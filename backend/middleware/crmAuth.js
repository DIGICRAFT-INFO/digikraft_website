const jwt = require('jsonwebtoken');
const CrmUser = require('../models/crm/CrmUser');

// ── Verify JWT ────────────────────────────────────────────────────────────────
const crmAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await CrmUser.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.is_active) return res.status(403).json({ message: 'Account pending approval' });
    req.crmUser = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ── Role guard helpers ────────────────────────────────────────────────────────
const crmOwnerOnly = (req, res, next) => {
  if (req.crmUser?.role !== 'owner') {
    return res.status(403).json({ message: 'Owner access required' });
  }
  next();
};

const crmManagerOrAbove = (req, res, next) => {
  if (!['owner', 'manager'].includes(req.crmUser?.role)) {
    return res.status(403).json({ message: 'Manager or Owner access required' });
  }
  next();
};

const crmFinanceOrAbove = (req, res, next) => {
  if (!['owner', 'manager', 'accountant'].includes(req.crmUser?.role)) {
    return res.status(403).json({ message: 'Finance access required' });
  }
  next();
};

module.exports = { crmAuth, crmOwnerOnly, crmManagerOrAbove, crmFinanceOrAbove };
