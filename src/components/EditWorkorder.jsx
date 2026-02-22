import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import CopyIdField from './CopyIdField';

const API_BASE = import.meta.env.VITE_WORKORDER_API || 'http://localhost:8082/restoam/workorders';
const ASSET_APP_URL = import.meta.env.VITE_ASSET_APP_URL || 'http://localhost:5173';
const LOCATION_APP_URL = import.meta.env.VITE_LOCATION_APP_URL || 'http://localhost:5174';

// Helper component for linked ID fields
function LinkedIdField({ id, label, appUrl, filterParam }) {
  if (!id) {
    return (
      <div className="col-md-6">
        <label className="form-label">{label}</label>
        <input
          type="text"
          className="form-control"
          value="None"
          disabled
          style={{ backgroundColor: '#f8f9fa' }}
        />
      </div>
    );
  }

  return (
    <div className="col-md-6">
      <label className="form-label">{label}</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control font-monospace"
          value={id}
          readOnly
          style={{ backgroundColor: '#f8f9fa' }}
        />
        <a
          href={`${appUrl}?${filterParam}=${id}`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline-primary"
          title={`Open in ${label.replace(' ID', '')} app`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
            <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

const emptyWorkorder = {
  title: '',
  description: '',
  status: 'OPEN',
  priority: 'MEDIUM',
  assetId: '',
  locationId: ''
};

function EditWorkorder() {
  const { id } = useParams();
  const [workorder, setWorkorder] = useState(emptyWorkorder);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_BASE}/${id}`)
      .then(response => {
        setWorkorder(response.data || emptyWorkorder);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workorder:', error);
        alert('Failed to load workorder.');
        setLoading(false);
      });
  }, [id]);

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
    axios.put(`${API_BASE}/${id}`, payload)
      .then(() => navigate('/'))
      .catch(error => {
        console.error('Error updating workorder:', error);
        alert('Failed to update workorder.');
      })
      .finally(() => setSaving(false));
  };

  if (loading) {
    return <p>Loading workorder...</p>;
  }

  return (
    <div className="form-section">
      <h2 className="section-title">Edit Workorder</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <CopyIdField id={id} label="Workorder ID" />
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
            <label className="form-label">
              Asset ID
              {workorder.assetId && (
                <a
                  href={`${ASSET_APP_URL}/edit/${workorder.assetId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ms-2 text-primary"
                  title="Open Asset"
                  style={{ fontSize: '0.875rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                    <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                  </svg>
                  Open
                </a>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="assetId"
              value={workorder.assetId || ''}
              onChange={handleChange}
              placeholder="Enter asset ID"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              Location ID
              {workorder.locationId && (
                <a
                  href={`${LOCATION_APP_URL}/edit/${workorder.locationId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="ms-2 text-primary"
                  title="Open Location"
                  style={{ fontSize: '0.875rem' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                    <path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                  </svg>
                  Open
                </a>
              )}
            </label>
            <input
              type="text"
              className="form-control"
              name="locationId"
              value={workorder.locationId || ''}
              onChange={handleChange}
              placeholder="Enter location ID"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={workorder.description || ''}
              onChange={handleChange}
              rows="3"
            />
          </div>
        </div>
        <div className="mt-4 d-flex gap-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default EditWorkorder;
