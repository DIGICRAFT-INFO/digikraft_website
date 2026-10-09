const CrmHistory = require('../../models/crm/CrmHistory');

exports.list = async (req, res) => {
  try {
    const { entity_type, entity_id, actor, action, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (entity_type) filter.entity_type = entity_type;
    if (entity_id) filter.entity_id = entity_id;
    if (actor) filter.actor = actor;
    if (action) filter.action = action;
    const skip = (Number(page) - 1) * Number(limit);
    const [logs, total] = await Promise.all([
      CrmHistory.find(filter).sort({ created_at: -1 }).skip(skip).limit(Number(limit)),
      CrmHistory.countDocuments(filter),
    ]);
    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
