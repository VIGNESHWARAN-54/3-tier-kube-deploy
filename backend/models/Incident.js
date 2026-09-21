const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Application Down', 'High CPU Usage', 'Database Connection Failed', 'Disk Space Low', 'Service Unavailable', 'Login Failure'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  assignedTo: { type: String, default: '' },
  remediationStatus: {
    type: String,
    enum: ['None', 'Pending', 'In Progress', 'Completed', 'Failed'],
    default: 'None'
  },
  remediationAction: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Incident', incidentSchema);
