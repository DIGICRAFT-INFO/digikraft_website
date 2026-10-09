const jwt = require('jsonwebtoken');
const CrmUser = require('../../models/crm/CrmUser');
const CrmHistory = require('../../models/crm/CrmHistory');

// ── Helpers ───────────────────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, portal: 'crm' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

const logHistory = async (actor, actorName, action, entityType, entityId, entityLabel, desc = '') => {
  try {
    await CrmHistory.create({ actor, actor_name: actorName, action, entity_type: entityType, entity_id: entityId, entity_label: entityLabel, description: desc });
  } catch { /* non-critical */ }
};

// ── Register ──────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'full_name, email, and password are required' });
    }
    const exists = await CrmUser.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await CrmUser.create({ full_name, email, password, phone: phone || '' });
    res.status(201).json({ message: 'Registration successful. Awaiting manager approval.', id: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Login ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await CrmUser.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.is_active) return res.status(403).json({ message: 'Account pending approval by manager' });

    const ok = await user.check_password(password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    await logHistory(user._id, user.full_name, 'login', 'user', user._id, user.full_name, 'CRM login');
    res.json({ token, role: user.role, full_name: user.full_name, id: user._id, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Me ────────────────────────────────────────────────────────────────────────
exports.me = async (req, res) => {
  res.json(req.crmUser.toJSON());
};

// ── Update Profile ────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['full_name', 'phone'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await CrmUser.findByIdAndUpdate(req.crmUser._id, updates, { new: true });
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Change Password ───────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    const user = await CrmUser.findById(req.crmUser._id);
    const ok = await user.check_password(old_password);
    if (!ok) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = new_password;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Pending Users (manager/owner) ─────────────────────────────────────────────
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await CrmUser.find({ is_active: false }).sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── All Active Users ──────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res) => {
  try {
    const users = await CrmUser.find({ is_active: true }).sort({ created_at: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Approve ───────────────────────────────────────────────────────────────────
exports.approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, page_access } = req.body;
    const user = await CrmUser.findByIdAndUpdate(
      userId,
      {
        is_active: true,
        role: role || 'executive',
        page_access: page_access || [],
        access_granted_by: req.crmUser._id,
        access_granted_at: new Date(),
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    await logHistory(req.crmUser._id, req.crmUser.full_name, 'access_granted', 'user', user._id, user.full_name, `Approved with role: ${user.role}`);
    res.json({ message: 'User approved', user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Reject ────────────────────────────────────────────────────────────────────
exports.rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await CrmUser.findByIdAndDelete(userId);
    res.json({ message: 'User registration rejected and removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Deactivate ────────────────────────────────────────────────────────────────
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await CrmUser.findByIdAndUpdate(userId, { is_active: false }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    await logHistory(req.crmUser._id, req.crmUser.full_name, 'access_revoked', 'user', user._id, user.full_name, 'Access deactivated');
    res.json({ message: 'User deactivated', user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Update User (page_access / role) ─────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const allowed = ['role', 'page_access', 'full_name', 'phone'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await CrmUser.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Verify (keep session alive) ───────────────────────────────────────────────
exports.verify = async (req, res) => {
  const user = await CrmUser.findById(req.crmUser._id);
  if (!user || !user.is_active) {
    return res.status(401).json({ valid: false });
  }
  res.json({ valid: true, role: user.role, page_access: user.page_access });
};
