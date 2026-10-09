const CrmSettings = require('../../models/crm/CrmSettings');

const SETTINGS_ID = 'crm_settings';

// ── Get settings (always returns a document, creates default if missing) ───────
exports.get = async (req, res) => {
  try {
    let settings = await CrmSettings.findById(SETTINGS_ID);
    if (!settings) {
      // Create with all defaults
      settings = await CrmSettings.create({ _id: SETTINGS_ID });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update settings (upsert) ──────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    // Remove protected fields from body
    const { _id, __v, created_at, ...updates } = req.body;

    const settings = await CrmSettings.findByIdAndUpdate(
      SETTINGS_ID,
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(settings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
