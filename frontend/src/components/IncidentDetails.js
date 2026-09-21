import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getIncident, updateIncident, remediateIncident } from '../services/api';

function IncidentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchIncident() {
      try {
        const res = await getIncident(id);
        setIncident(res.data);
      } catch (err) {
        console.error('Failed to fetch incident:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchIncident();
  }, [id]);

  async function handleStatusUpdate(newStatus) {
    try {
      const res = await updateIncident(id, { status: newStatus });
      setIncident(res.data);
      setMessage(`Status updated to "${newStatus}"`);
    } catch (err) {
      setMessage('Failed to update status');
    }
  }

  async function handleRemediate() {
    try {
      const res = await remediateIncident(id);
      setIncident(res.data.incident);
      setMessage(`✅ ${res.data.message}: ${res.data.action}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Remediation failed');
    }
  }

  if (loading) return <div className="loading">Loading incident...</div>;
  if (!incident) return <div className="empty-state">Incident not found</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Incident Details</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/incidents')}>
          ← Back to List
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="detail-card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{incident.title}</h2>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Status</label>
            <p>
              <span className={`badge badge-${incident.status.toLowerCase().replace(' ', '-')}`}>
                {incident.status}
              </span>
            </p>
          </div>
          <div className="detail-item">
            <label>Priority</label>
            <p>
              <span className={`badge badge-${incident.priority.toLowerCase()}`}>
                {incident.priority}
              </span>
            </p>
          </div>
          <div className="detail-item">
            <label>Category</label>
            <p>{incident.category}</p>
          </div>
          <div className="detail-item">
            <label>Assigned To</label>
            <p>{incident.assignedTo || '—'}</p>
          </div>
          <div className="detail-item">
            <label>Created</label>
            <p>{new Date(incident.createdAt).toLocaleString()}</p>
          </div>
          <div className="detail-item">
            <label>Last Updated</label>
            <p>{new Date(incident.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="detail-description">
          <label>Description</label>
          <p>{incident.description}</p>
        </div>

        {incident.remediationStatus !== 'None' && (
          <div className={`remediation-banner ${incident.remediationStatus === 'Completed' ? '' : 'pending'}`}>
            <h4>Auto-Remediation: {incident.remediationStatus}</h4>
            {incident.remediationAction && <p>Action: {incident.remediationAction}</p>}
          </div>
        )}

        <div className="detail-actions">
          {incident.status === 'Open' && (
            <button className="btn btn-warning" onClick={() => handleStatusUpdate('In Progress')}>
              Start Investigation
            </button>
          )}
          {incident.status !== 'Resolved' && (
            <button className="btn btn-success" onClick={() => handleStatusUpdate('Resolved')}>
              Resolve Incident
            </button>
          )}
          {incident.status !== 'Resolved' && incident.remediationStatus !== 'Completed' && (
            <button className="btn btn-primary" onClick={handleRemediate}>
              Trigger Auto-Remediation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default IncidentDetails;
