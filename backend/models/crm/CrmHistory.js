const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * CRM History / Activity Log — audit trail for all CRM actions.
 */
const crmHistorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    actor: { type: String, ref: 'CrmUser', default: null },
    actor_name: { type: String, default: 'System' },
    action: {
      type: String,
      enum: [
        'created', 'updated', 'deleted',
        'status_changed', 'payment_received', 'sent', 'approved', 'rejected',
        'login', 'logout', 'access_granted', 'access_revoked',
      ],
      required: true,
    },
    entity_type: {
      type: String,
      enum: [
        'client', 'project', 'service', 'proposal', 'quotation',
        'invoice', 'payment', 'portfolio', 'enquiry', 'user',
      ],
      required: true,
    },
    entity_id: { type: String, default: null },
    entity_label: { type: String, default: '' }, // human-readable name
    description: { type: String, default: '' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: 'crm_history',
  }
);

crmHistorySchema.index({ created_at: -1 });
crmHistorySchema.index({ entity_type: 1, entity_id: 1 });

crmHistorySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.models.CrmHistory || mongoose.model('CrmHistory', crmHistorySchema);
