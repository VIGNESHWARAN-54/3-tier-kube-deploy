const mongoose = require('mongoose');
require('dotenv').config();

const Incident = require('./models/Incident');

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || '27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'incident_management';
const MONGO_URI = process.env.MONGO_URI || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DATABASE_NAME}`;

const sampleIncidents = [
  {
    title: 'Application Server Down',
    description: 'Main application server is not responding to requests. Users unable to access the platform.',
    category: 'Application Down',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'DevOps Engineer',
    remediationStatus: 'None'
  },
  {
    title: 'High CPU Usage on Production Server',
    description: 'CPU usage has exceeded 95% on the production server for the last 30 minutes.',
    category: 'High CPU Usage',
    priority: 'High',
    status: 'Open',
    assignedTo: 'System Administrator',
    remediationStatus: 'None'
  },
  {
    title: 'Database Connection Failed',
    description: 'Backend services unable to connect to the primary database. Connection timeout errors in logs.',
    category: 'Database Connection Failed',
    priority: 'Critical',
    status: 'In Progress',
    assignedTo: 'Database Admin',
    remediationStatus: 'Pending'
  },
  {
    title: 'Disk Space Low on Log Server',
    description: 'Log server disk usage at 92%. Log rotation may have failed.',
    category: 'Disk Space Low',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'DevOps Engineer',
    remediationStatus: 'None'
  },
  {
    title: 'Payment Service Unavailable',
    description: 'Payment processing service returning 503 errors. Customers unable to complete transactions.',
    category: 'Service Unavailable',
    priority: 'Critical',
    status: 'Open',
    assignedTo: 'Backend Developer',
    remediationStatus: 'None'
  },
  {
    title: 'SSO Login Failure',
    description: 'Users reporting intermittent login failures with SSO authentication.',
    category: 'Login Failure',
    priority: 'High',
    status: 'Resolved',
    assignedTo: 'Security Engineer',
    remediationStatus: 'Completed',
    remediationAction: 'Authentication service restart simulated'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Incident.deleteMany({});
    console.log('Cleared existing incidents');

    await Incident.insertMany(sampleIncidents);
    console.log('Inserted sample incidents');

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
