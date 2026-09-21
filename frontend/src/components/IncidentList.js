import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getIncidents, deleteIncident } from '../services/api';

function IncidentList() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function fetchIncidents() {
    try {
      const res = await getIncidents();
      setIncidents(res.data);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(e, id) {
    e.stopPropagation();
    if (window.confirm('Delete this incident?')) {
      try {
        await deleteIncident(id);
        setIncidents(incidents.filter(i => i._id !== id));
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  }

  if (loading) return <div className="loading">Loading incidents...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>All Incidents</h1>
        <Link to="/incidents/new" className="btn btn-primary">+ New Incident</Link>
      </div>

      {incidents.length === 0 ? (
        <div className="empty-state">
          <p>No incidents found. Create one to get started.</p>
        </div>
      ) : (
        <div className="incident-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map(incident => (
                <tr key={incident._id} onClick={() => navigate(`/incidents/${incident._id}`)}>
                  <td>{incident.title}</td>
                  <td>{incident.category}</td>
                  <td>
                    <span className={`badge badge-${incident.priority.toLowerCase()}`}>
                      {incident.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${incident.status.toLowerCase().replace(' ', '-')}`}>
                      {incident.status}
                    </span>
                  </td>
                  <td>{incident.assignedTo || '—'}</td>
                  <td>{new Date(incident.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => handleDelete(e, incident._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default IncidentList;
