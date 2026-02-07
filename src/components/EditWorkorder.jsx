import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
              value={workorder.assetId || ''}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Location ID</label>
            <input
              type="text"
              className="form-control"
              name="locationId"
              value={workorder.locationId || ''}
              onChange={handleChange}
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
