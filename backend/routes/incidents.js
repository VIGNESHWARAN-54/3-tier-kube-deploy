const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// Remediation actions mapped to incident categories
const remediationActions = {
  'Service Unavailable': 'Application service restart simulated',
  'Application Down': 'Application process restart simulated',
  'High CPU Usage': 'Resource-heavy processes terminated and service restarted',
  'Database Connection Failed': 'Database connection pool reset simulated',
  'Disk Space Low': 'Temporary files cleanup simulated',
  'Login Failure': 'Authentication service restart simulated'
};

// GET /api/incidents/stats - Dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const total = await Incident.countDocuments();
    const open = await Incident.countDocuments({ status: 'Open' });
    const inProgress = await Incident.countDocuments({ status: 'In Progress' });
    const resolved = await Incident.countDocuments({ status: 'Resolved' });
    const critical = await Incident.countDocuments({ priority: 'Critical' });

    res.json({ total, open, inProgress, resolved, critical });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/incidents - Get all incidents
router.get('/', async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/incidents/:id - Get single incident
router.get('/:id', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/incidents - Create new incident
router.post('/', async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    res.status(201).json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/incidents/:id - Update incident
router.put('/:id', async (req, res) => {
  try {
    const incident = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json(incident);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/incidents/:id - Delete incident
router.delete('/:id', async (req, res) => {
  try {
    const incident = await Incident.findByIdAndDelete(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });
    res.json({ message: 'Incident deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/incidents/:id/remediate - Auto-remediation
router.post('/:id/remediate', async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    const action = remediationActions[incident.category];
    if (!action) {
      return res.status(400).json({
        message: 'No auto-remediation available for this category',
        status: 'failed'
      });
    }

    // Simulate remediation delay
    console.log(`Auto-remediation triggered for: ${incident.title}`);
    console.log(`Action: ${action}`);

    incident.remediationStatus = 'Completed';
    incident.remediationAction = action;
    incident.status = 'In Progress';
    await incident.save();

    res.json({
      message: 'Auto-remediation triggered',
      action: action,
      status: 'success',
      incident
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
