const CrmInvoice = require('../../models/crm/CrmInvoice');
const CrmInvoiceItem = require('../../models/crm/CrmInvoiceItem');
const CrmProject = require('../../models/crm/CrmProject');
const CrmClient = require('../../models/crm/CrmClient');
const CrmHistory = require('../../models/crm/CrmHistory');
const CrmNotification = require('../../models/crm/CrmNotification');

const log = async (req, action, id, label, desc = '') => {
  try {
    await CrmHistory.create({ actor: req.crmUser._id, actor_name: req.crmUser.full_name, action, entity_type: 'invoice', entity_id: id, entity_label: label, description: desc });
  } catch {}
};

const genInvNumber = async () => {
  const count = await CrmInvoice.countDocuments();
  const year = new Date().getFullYear();
  return `DKS-INV-${year}-${String(count + 1).padStart(4, '0')}`;
};

const calcTotals = (items = [], cgstRate = 9, sgstRate = 9, igstRate = 0) => {
  const subtotal = items.reduce((s, i) => s + (Number(i.total_price) || (i.quantity || 1) * (i.unit_price || 0)), 0);
  const cgst = (subtotal * cgstRate) / 100;
  const sgst = (subtotal * sgstRate) / 100;
  const igst = (subtotal * igstRate) / 100;
  const totalTax = cgst + sgst + igst;
  return { subtotal, taxable_amount: subtotal, cgst_amount: cgst, sgst_amount: sgst, igst_amount: igst, total_tax: totalTax, grand_total: subtotal + totalTax };
};

exports.list = async (req, res) => {
  try {
    const { status, project, client } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // Filter by client: find all projects for this client, then filter invoices
    if (client) {
      const projects = await CrmProject.find({ client }).select('_id');
      filter.project = { $in: projects.map(p => p._id) };
    } else if (project) {
      filter.project = project;
    }

    const invoices = await CrmInvoice.find(filter).populate('project', 'name client_name_snapshot').sort({ invoice_date: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const inv = await CrmInvoice.findById(req.params.id).populate('project').populate('items');
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    res.json(inv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { project: projectId, items = [], cgst_rate = 9, sgst_rate = 9, igst_rate = 0, ...rest } = req.body;
    const project = await CrmProject.findById(projectId).populate('client');
    const invoice_number = await genInvNumber();
    const totals = calcTotals(items, cgst_rate, sgst_rate, igst_rate);

    // Pull client details for snapshots
    const CrmClient = require('../../models/crm/CrmClient');
    const client = project?.client
      ? (typeof project.client === 'object' ? project.client : await CrmClient.findById(project.client))
      : null;

    const invoice = await CrmInvoice.create({
      project: projectId, invoice_number,
      project_name_snapshot:   project?.name || '',
      client_name_snapshot:    client?.full_name || client?.company_name || project?.client_name_snapshot || '',
      client_gstin_snapshot:   client?.gstin || '',
      client_address_snapshot: client?.billing_address || '',
      client_state_snapshot:   client?.state || '',
      billing_address:         client?.billing_address || '',
      cgst_rate, sgst_rate, igst_rate, ...totals, ...rest,
    });
    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await CrmInvoiceItem.create({ invoice: invoice._id, description: it.description, quantity: it.quantity || 1, unit_price: it.unit_price || 0, total_price: (it.quantity || 1) * (it.unit_price || 0), sort_order: i });
      }
    }
    await log(req, 'created', invoice._id, invoice.invoice_number, `Created invoice ${invoice.invoice_number}`);
    await CrmNotification.create({ user: req.crmUser._id, event_type: 'invoice_created', title: 'New Invoice Created', message: `${invoice.invoice_number} — ₹${totals.grand_total.toLocaleString('en-IN')}`, reference_id: invoice._id, reference_type: 'invoice' });
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { items, cgst_rate, sgst_rate, igst_rate, ...rest } = req.body;
    const old = await CrmInvoice.findById(req.params.id);
    const updates = { ...rest };
    if (items) {
      const totals = calcTotals(items, cgst_rate ?? old.cgst_rate, sgst_rate ?? old.sgst_rate, igst_rate ?? old.igst_rate);
      Object.assign(updates, { cgst_rate, sgst_rate, igst_rate, ...totals });
      await CrmInvoiceItem.deleteMany({ invoice: req.params.id });
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        await CrmInvoiceItem.create({ invoice: req.params.id, description: it.description, quantity: it.quantity || 1, unit_price: it.unit_price || 0, total_price: (it.quantity || 1) * (it.unit_price || 0), sort_order: i });
      }
    }
    const invoice = await CrmInvoice.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    const action = old?.status !== invoice.status ? 'status_changed' : 'updated';
    await log(req, action, invoice._id, invoice.invoice_number, `${action} invoice`);
    if (invoice.status === 'paid') {
      await CrmNotification.create({ user: req.crmUser._id, event_type: 'invoice_paid', title: 'Invoice Paid', message: `${invoice.invoice_number} marked as paid`, reference_id: invoice._id, reference_type: 'invoice' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const inv = await CrmInvoice.findByIdAndDelete(req.params.id);
    if (!inv) return res.status(404).json({ message: 'Invoice not found' });
    await CrmInvoiceItem.deleteMany({ invoice: req.params.id });
    await log(req, 'deleted', inv._id, inv.invoice_number, 'Deleted invoice');
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
