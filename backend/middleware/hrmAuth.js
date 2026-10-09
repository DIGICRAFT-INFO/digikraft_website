const jwt     = require('jsonwebtoken');
const HrmUser = require('../models/hrm/HrmUser');

// ── Helpers ───────────────────────────────────────────────────────────────────
const getIP = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress || '';

// ── Core JWT guard ────────────────────────────────────────────────────────────
const hrmAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token   = header.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Portal claim check — prevent CRM/EMP tokens being used here
    if (decoded.portal !== 'hrm')
      return res.status(401).json({ message: 'Invalid portal token' });

    const user = await HrmUser.findById(decoded.id).lean();
    if (!user)       return res.status(401).json({ message: 'User not found' });
    if (!user.is_active) return res.status(403).json({ message: 'Account pending approval' });

    // Account lockout check
    if (user.locked_until && new Date(user.locked_until) > new Date())
      return res.status(423).json({ message: 'Account temporarily locked' });

    req.hrmUser = user;
    req.clientIP = getIP(req);
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Auth error' });
  }
};

// ── Role guards ───────────────────────────────────────────────────────────────
const hrmAdminOnly = (req, res, next) => {
  if (req.hrmUser?.role !== 'hr_admin')
    return res.status(403).json({ message: 'HR Admin access required' });
  next();
};

const hrmManagerOrAbove = (req, res, next) => {
  if (!['hr_admin', 'hr_manager'].includes(req.hrmUser?.role))
    return res.status(403).json({ message: 'HR Manager or above required' });
  next();
};

const hrmAnyRole = (req, res, next) => {
  // All authenticated HRM users
  next();
};

// ── Department Manager scope guard ────────────────────────────────────────────
// dept_manager can only access employees in their department
const hrmDeptScope = (req, res, next) => {
  if (req.hrmUser?.role === 'dept_manager') {
    req.deptScope = req.hrmUser.department;  // restrict queries to this dept
  } else {
    req.deptScope = null; // no restriction
  }
  next();
};

module.exports = { hrmAuth, hrmAdminOnly, hrmManagerOrAbove, hrmAnyRole, hrmDeptScope };
