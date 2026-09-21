import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createIncident } from '../services/api';

function CreateIncident() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Application Down',
    priority: 'Medium',
    assignedTo: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.title || !form.description) {
      setError('Title and Description are required');
      return;
    }

    try {
      await createIncident(form);
      navigate('/incidents');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create incident');
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Create Incident</h1>
      </div>

      <div className="form-card">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Application Server Down"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the incident..."
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="Application Down">Application Down</option>
              <option value="High CPU Usage">High CPU Usage</option>
              <option value="Database Connection Failed">Database Connection Failed</option>
              <option value="Disk Space Low">Disk Space Low</option>
              <option value="Service Unavailable">Service Unavailable</option>
              <option value="Login Failure">Login Failure</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assigned To</label>
            <input
              type="text"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="e.g. DevOps Engineer"
            />
          </div>

          <button type="submit" className="btn btn-primary">Create Incident</button>
        </form>
      </div>
    </div>
  );
}

export default CreateIncident;
