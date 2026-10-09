const jwt         = require('jsonwebtoken');
const HrmEmployee = require('../models/hrm/HrmEmployee');

const getIP = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
  req.socket?.remoteAddress || '';

// ── Core JWT guard for Employee Portal ───────────────────────────────────────
const empAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token = header.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Portal claim — prevent HRM/CRM tokens leaking in
    if (decoded.portal !== 'emp')
      return res.status(401).json({ message: 'Invalid portal token' });

    const employee = await HrmEmployee.findById(decoded.id)
      .populate('department', 'name')
      .populate('designation', 'title')
      .populate('reporting_manager', 'full_name work_email')
      .lean();

    if (!employee)         return res.status(401).json({ message: 'Employee not found' });
    if (!employee.is_active) return res.status(403).json({ message: 'Account disabled' });

    // Account lockout
    if (employee.locked_until && new Date(employee.locked_until) > new Date())
      return res.status(423).json({ message: 'Account temporarily locked' });

    req.empUser  = employee;
    req.clientIP = getIP(req);
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Auth error' });
  }
};

// EMP portal has only one role — employee.
// This guard is a placeholder for future employee sub-roles.
const empSelf = (req, res, next) => next();

module.exports = { empAuth, empSelf };
