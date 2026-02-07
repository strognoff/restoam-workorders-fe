import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_WORKORDER_API || 'http://localhost:8082/restoam/workorders';

const emptyWorkorder = {
  title: '',
  description: '',
  status: 'OPEN',
  priority: 'MEDIUM',
  assetId: '',
  locationId: ''
};

function AddWorkorder() {
  const [workorder, setWorkorder] = useState(emptyWorkorder);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkorder({ ...workorder, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...workorder,
      assetId: workorder.assetId || null,
      locationId: workorder.locationId || null
    };
    axios.post(API_BASE, payload)
      .then(() => navigate('/'))
      .catch(error => {
        console.error('Error creating workorder:', error);
        alert('Failed to create workorder.');
      })
      .finally(() => setSaving(false));
  };

  return (
    <div className="form-section">
      <h2 className="section-title">Add Workorder</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={workorder.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={workorder.status}
              onChange={handleChange}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Priority</label>
            <select
              className="form-select"
              name="priority"
              value={workorder.priority}
              onChange={handleChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Asset ID</label>
            <input
              type="text"
              className="form-control"
              name="assetId"
              value={workorder.assetId}
              onChange={handleChange}
              placeholder="UUID"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location ID</label>
            <input
              type="text"
              className="form-control"
              name="locationId"
              value={workorder.locationId}
              onChange={handleChange}
              placeholder="UUID"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={workorder.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>
        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Create Workorder'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddWorkorder;
