const mongoose = require('mongoose');

/**
 * CRM Settings — singleton document for DigiKraft Social CRM config.
 * Company info, bank details, tax defaults, invoice numbering, etc.
 * Only one document exists (upserted by ID "crm_settings").
 */
const crmSettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: 'crm_settings' },

    // ── Company Info ──────────────────────────────────────────────────────────
    company_name:    { type: String, default: 'Digikraft Social' },
    company_email:   { type: String, default: 'info@digikraftsocial.com' },
    company_phone:   { type: String, default: '9302279701' },
    company_address: { type: String, default: '270/1, Swami Vivekanand Ward, Budhapara, Dani Wada, Raipur' },
    company_city:    { type: String, default: 'Raipur' },
    company_state:   { type: String, default: 'Chhattisgarh' },
    company_pincode: { type: String, default: '492001' },
    company_country: { type: String, default: 'India' },
    company_website: { type: String, default: 'https://digikraftsocial.com' },
    company_logo:    { type: String, default: '' }, // URL or path

    // ── GST / Tax ─────────────────────────────────────────────────────────────
    gstin:           { type: String, default: '22AARFD5166H1ZB' },
    state_code:      { type: String, default: '22' },
    default_cgst_rate:{ type: Number, default: 9 },
    default_sgst_rate:{ type: Number, default: 9 },
    default_igst_rate:{ type: Number, default: 0 },
    default_hsn_sac: { type: String, default: '998319' },
    place_of_supply: { type: String, default: 'Chhattisgarh' },

    // ── Bank Details ──────────────────────────────────────────────────────────
    bank_name:       { type: String, default: 'HDFC Bank' },
    account_name:    { type: String, default: 'Digikraft Social' },
    account_number:  { type: String, default: '50200054829505' },
    ifsc_code:       { type: String, default: 'HDFC0002706' },
    branch:          { type: String, default: '' },
    upi_id:          { type: String, default: '9021073372@hdfcbank' },

    // ── Invoice / Quotation Numbering ─────────────────────────────────────────
    invoice_prefix:   { type: String, default: 'DKS-INV' },
    quotation_prefix: { type: String, default: 'DKS-Q' },
    proposal_prefix:  { type: String, default: 'DKS-PROP' },

    // ── Payment Terms ─────────────────────────────────────────────────────────
    default_due_days:      { type: Number, default: 30 },
    late_fee_percent:      { type: Number, default: 1.5 },
    payment_terms_text:    { type: String, default: '' }, // custom terms override

    // ── Signature / Footer ────────────────────────────────────────────────────
    invoice_footer_text: { type: String, default: 'This is a Computer Generated Invoice' },
    signature_name:      { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'crm_settings',
  }
);

module.exports = mongoose.models.CrmSettings || mongoose.model('CrmSettings', crmSettingsSchema);
