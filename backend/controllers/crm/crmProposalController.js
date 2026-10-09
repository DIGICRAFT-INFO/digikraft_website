const CrmProposal = require('../../models/crm/CrmProposal');
const CrmProject = require('../../models/crm/CrmProject');
const CrmClient = require('../../models/crm/CrmClient');
const CrmHistory = require('../../models/crm/CrmHistory');
const CrmNotification = require('../../models/crm/CrmNotification');

const log = async (req, action, id, label, desc = '') => {
  try {
    await CrmHistory.create({ actor: req.crmUser._id, actor_name: req.crmUser.full_name, action, entity_type: 'proposal', entity_id: id, entity_label: label, description: desc });
  } catch {}
};

// Auto-generate proposal number
const genPropNumber = async () => {
  const count = await CrmProposal.countDocuments();
  const year = new Date().getFullYear();
  return `DKS-PROP-${year}-${String(count + 1).padStart(4, '0')}`;
};

exports.list = async (req, res) => {
  try {
    const { status, project, client } = req.query;
    const filter = {};
    if (status) filter.status = status;

    // Filter by client: find all projects for this client, then filter proposals
    if (client) {
      const projects = await CrmProject.find({ client }).select('_id');
      filter.project = { $in: projects.map(p => p._id) };
    } else if (project) {
      filter.project = project;
    }

    const proposals = await CrmProposal.find(filter).populate('project', 'name client_name_snapshot').populate('services', 'name').sort({ created_at: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const p = await CrmProposal.findById(req.params.id).populate('project').populate('services');
    if (!p) return res.status(404).json({ message: 'Proposal not found' });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { project: projectId, ...rest } = req.body;
    const project = await CrmProject.findById(projectId).populate('client');
    const prop_number = await genPropNumber();
    const proposal = await CrmProposal.create({
      project: projectId,
      prop_number,
      project_name_snapshot: project?.name || '',
      client_name_snapshot: project?.client?.full_name || '',
      ...rest,
    });
    await log(req, 'created', proposal._id, proposal.title, `Created proposal: ${proposal.prop_number}`);
    await CrmNotification.create({ user: req.crmUser._id, event_type: 'proposal_created', title: 'New Proposal Created', message: `${proposal.prop_number} — ${proposal.title}`, reference_id: proposal._id, reference_type: 'proposal' });
    res.status(201).json(proposal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const old = await CrmProposal.findById(req.params.id);
    const proposal = await CrmProposal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
    const action = old?.status !== proposal.status ? 'status_changed' : 'updated';
    await log(req, action, proposal._id, proposal.prop_number, `${action} proposal`);
    if (proposal.status === 'accepted') {
      await CrmNotification.create({ user: req.crmUser._id, event_type: 'proposal_accepted', title: 'Proposal Accepted', message: `${proposal.prop_number} was accepted`, reference_id: proposal._id, reference_type: 'proposal' });
    }
    res.json(proposal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const p = await CrmProposal.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: 'Proposal not found' });
    await log(req, 'deleted', p._id, p.prop_number, 'Deleted proposal');
    res.json({ message: 'Proposal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
