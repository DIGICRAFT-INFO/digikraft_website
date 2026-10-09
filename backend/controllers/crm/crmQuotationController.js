const CrmQuotation = require('../../models/crm/CrmQuotation');
const CrmQuotationItem = require('../../models/crm/CrmQuotationItem');
const CrmProject = require('../../models/crm/CrmProject');
const CrmHistory = require('../../models/crm/CrmHistory');
const CrmNotification = require('../../models/crm/CrmNotification');

const log = async (req, action, id, label, desc = '') => {
  try {
    await CrmHistory.create({ actor: req.crmUser._id, actor_name: req.crmUser.full_name, action, entity_type: 'quotation', entity_id: id, entity_label: label, description: desc });
  } catch {}
};

const genQuoteNumber = async () => {
  const count = await CrmQuotation.countDocuments();
  const year = new Date().getFullYear();
  return `DKS-Q-${year}-${String(count + 1).padStart(4, '0')}`;
};

const calcTotals = (items = [], discType = 'fixed', discVal = 0, cgstRate = 9, sgstRate = 9, igstRate = 0) => {
  const subtotal = items.reduce((s, i) => s + (i.total_price || i.quantity * i.unit_price || 0), 0);
  const discAmt = discType === 'percentage' ? (subtotal * discVal) / 100 : discVal;
  const taxable = subtotal - discAmt;
  const cgst = (taxable * cgstRate) / 100;
  const sgst = (taxable * sgstRate) / 100;
  const igst = (taxable * igstRate) / 100;
  const totalTax = cgst + sgst + igst;
  return { subtotal, discount_amount: discAmt, taxable_amount: taxable, cgst_amount: cgst, sgst_amount: sgst, igst_amount: igst, total_tax: totalTax, grand_total: taxable + totalTax };
};

exports.list = async (req, res) => {
  try {
    const { status, project, client } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // Filter by client: find all projects for this client, then filter quotations
    if (client) {
      const projects = await CrmProject.find({ client }).select('_id');
      filter.project = { $in: projects.map(p => p._id) };
    } else if (project) {
      filter.project = project;
    }

    const quotes = await CrmQuotation.find(filter).populate('project', 'name client_name_snapshot').sort({ created_at: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const q = await CrmQuotation.findById(req.params.id).populate('project').populate('items');
    if (!q) return res.status(404).json({ message: 'Quotation not found' });
    res.json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { project: projectId, items = [], discount_type = 'fixed', discount_value = 0, cgst_rate = 9, sgst_rate = 9, igst_rate = 0, ...rest } = req.body;
    const project = await CrmProject.findById(projectId).populate('client');
    const quote_number = await genQuoteNumber();
    const totals = calcTotals(items, discount_type, discount_value, cgst_rate, sgst_rate, igst_rate);

    const client = project?.client || null;
    const quotation = await CrmQuotation.create({
      project: projectId,
      quote_number,
      project_name_snapshot:   project?.name || '',
      client_name_snapshot:    client?.full_name || client?.company_name || project?.client_name_snapshot || '',
      client_gstin_snapshot:   client?.gstin || '',
      client_address_snapshot: client?.billing_address || '',
      client_state_snapshot:   client?.state || '',
      billing_address:         client?.billing_address || '',
      discount_type, discount_value, cgst_rate, sgst_rate, igst_rate,
      ...totals, ...rest,
    });
    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await CrmQuotationItem.create({ quotation: quotation._id, description: it.description, quantity: it.quantity || 1, unit_price: it.unit_price || 0, total_price: (it.quantity || 1) * (it.unit_price || 0), sort_order: i });
      }
    }
    await log(req, 'created', quotation._id, quotation.quote_number, `Created quotation ${quotation.quote_number}`);
    await CrmNotification.create({ user: req.crmUser._id, event_type: 'quotation_created', title: 'New Quotation', message: `${quotation.quote_number} created — ₹${totals.grand_total.toLocaleString('en-IN')}`, reference_id: quotation._id, reference_type: 'quotation' });
    res.status(201).json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { items, discount_type, discount_value, cgst_rate, sgst_rate, igst_rate, ...rest } = req.body;
    const old = await CrmQuotation.findById(req.params.id);
    const updates = { ...rest };
    if (items) {
      const totals = calcTotals(items, discount_type || old.discount_type, discount_value ?? old.discount_value, cgst_rate ?? old.cgst_rate, sgst_rate ?? old.sgst_rate, igst_rate ?? old.igst_rate);
      Object.assign(updates, { discount_type, discount_value, cgst_rate, sgst_rate, igst_rate, ...totals });
      await CrmQuotationItem.deleteMany({ quotation: req.params.id });
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await CrmQuotationItem.create({ quotation: req.params.id, description: it.description, quantity: it.quantity || 1, unit_price: it.unit_price || 0, total_price: (it.quantity || 1) * (it.unit_price || 0), sort_order: i });
      }
    }
    const quotation = await CrmQuotation.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    const action = old?.status !== quotation.status ? 'status_changed' : 'updated';
    await log(req, action, quotation._id, quotation.quote_number, `${action} quotation`);
    if (quotation.status === 'approved') {
      await CrmNotification.create({ user: req.crmUser._id, event_type: 'quotation_approved', title: 'Quotation Approved', message: `${quotation.quote_number} was approved`, reference_id: quotation._id, reference_type: 'quotation' });
    }
    res.json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const q = await CrmQuotation.findByIdAndDelete(req.params.id);
    if (!q) return res.status(404).json({ message: 'Quotation not found' });
    await CrmQuotationItem.deleteMany({ quotation: req.params.id });
    await log(req, 'deleted', q._id, q.quote_number, 'Deleted quotation');
    res.json({ message: 'Quotation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
