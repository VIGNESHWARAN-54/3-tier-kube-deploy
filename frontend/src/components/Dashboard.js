import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStats, getIncidents } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, critical: 0 });
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, incidentsRes] = await Promise.all([getStats(), getIncidents()]);
        setStats(statsRes.data);
        setRecentIncidents(incidentsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Incidents</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card open">
          <h3>Open</h3>
          <div className="stat-number">{stats.open}</div>
        </div>
        <div className="stat-card in-progress">
          <h3>In Progress</h3>
          <div className="stat-number">{stats.inProgress}</div>
        </div>
        <div className="stat-card resolved">
          <h3>Resolved</h3>
          <div className="stat-number">{stats.resolved}</div>
        </div>
        <div className="stat-card critical">
          <h3>Critical</h3>
          <div className="stat-number">{stats.critical}</div>
        </div>
      </div>

      <div className="page-header">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Recent Incidents</h2>
        <Link to="/incidents" className="btn btn-primary btn-sm">View All</Link>
      </div>

      <div className="incident-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentIncidents.map(incident => (
              <tr key={incident._id} onClick={() => window.location.href = `/incidents/${incident._id}`}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
