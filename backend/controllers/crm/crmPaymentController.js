const CrmPayment = require('../../models/crm/CrmPayment');
const CrmInvoice = require('../../models/crm/CrmInvoice');
const CrmHistory = require('../../models/crm/CrmHistory');
const CrmNotification = require('../../models/crm/CrmNotification');

const log = async (req, action, id, label, desc = '') => {
  try {
    await CrmHistory.create({ actor: req.crmUser._id, actor_name: req.crmUser.full_name, action, entity_type: 'payment', entity_id: id, entity_label: label, description: desc });
  } catch {}
};

exports.list = async (req, res) => {
  try {
    const { invoice } = req.query;
    const filter = invoice ? { invoice } : {};
    const payments = await CrmPayment.find(filter).populate('invoice', 'invoice_number grand_total client_name_snapshot').sort({ payment_date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { invoice: invoiceId, amount_paid, payment_date, payment_mode, reference_number, notes } = req.body;
    const invoice = await CrmInvoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    const payment = await CrmPayment.create({ invoice: invoiceId, amount_paid, payment_date, payment_mode: payment_mode || 'upi', reference_number, notes });
    // balance recalc handled by model hook
    await log(req, 'payment_received', payment._id, invoice.invoice_number, `₹${amount_paid} received against ${invoice.invoice_number}`);
    await CrmNotification.create({ user: req.crmUser._id, event_type: 'payment_received', title: 'Payment Received', message: `₹${amount_paid.toLocaleString('en-IN')} received for ${invoice.invoice_number}`, reference_id: invoiceId, reference_type: 'invoice' });
    res.status(201).json(payment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const payment = await CrmPayment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    await log(req, 'deleted', payment._id, `Payment #${payment._id}`, 'Deleted payment');
    res.json({ message: 'Payment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
