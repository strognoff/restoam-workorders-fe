import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_WORKORDER_API || 'http://localhost:8082/restoam/workorders';
const ASSET_APP_URL = import.meta.env.VITE_ASSET_APP_URL || 'http://localhost:5173';
const LOCATION_APP_URL = import.meta.env.VITE_LOCATION_APP_URL || 'http://localhost:5174';

// Status chip colors
const statusColors = {
  OPEN: { bg: '#dbeafe', text: '#1e40af', label: 'Open' },
  IN_PROGRESS: { bg: '#fef3c7', text: '#92400e', label: 'In Progress' },
  DONE: { bg: '#dcfce7', text: '#166534', label: 'Done' },
  CANCELLED: { bg: '#f3f4f6', text: '#4b5563', label: 'Cancelled' },
};

// Priority chip colors
const priorityColors = {
  LOW: { bg: '#e0f2fe', text: '#0369a1', label: 'Low' },
  MEDIUM: { bg: '#fef9c3', text: '#854d0e', label: 'Medium' },
  HIGH: { bg: '#fed7aa', text: '#c2410c', label: 'High' },
  CRITICAL: { bg: '#fecaca', text: '#b91c1c', label: 'Critical' },
};

// Chip component
function Chip({ value, colorMap }) {
  const colors = colorMap[value] || { bg: '#f3f4f6', text: '#4b5563', label: value };
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {colors.label}
    </span>
  );
}

const initialFilters = {
  title: '',
  status: '',
  priority: ''
};

function WorkorderList() {
  const [workorders, setWorkorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState(initialFilters);

  const fetchWorkorders = () => {
    setLoading(true);
    axios.get(API_BASE, {
      params: {
        page,
        size,
        sortBy: 'createdDate',
        sortDir: 'desc',
        title: filters.title || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined
      }
    })
      .then(response => {
        setWorkorders(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workorders:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkorders();
  }, [page, size, filters]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this workorder?')) return;
    axios.delete(`${API_BASE}/${id}`)
      .then(() => fetchWorkorders())
      .catch(error => {
        console.error('Error deleting workorder:', error);
        alert('Failed to delete workorder.');
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(0);
  };

  return (
    <div>
      <div className="form-section mb-4">
        <h1 className="section-title">Workorders</h1>
        <p className="text-muted">Track maintenance requests and assign priority.</p>
        <div className="card-header-actions">
          <Link to="/add" className="btn btn-primary">Add Workorder</Link>
        </div>
      </div>

      <div className="form-section">
        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Filter by title"
              value={filters.title}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="">All priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p>Loading workorders...</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Asset</th>
                    <th>Location</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workorders.map(workorder => (
                    <tr key={workorder.id}>
                      <td>{workorder.title}</td>
                      <td>
                        <Chip value={workorder.status} colorMap={statusColors} />
                      </td>
                      <td>
                        <Chip value={workorder.priority} colorMap={priorityColors} />
                      </td>
                      <td>
                        {workorder.assetId ? (
                          <a
                            className="btn btn-sm btn-outline-primary"
                            href={`${ASSET_APP_URL}/edit/${workorder.assetId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Asset
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>
                        {workorder.locationId ? (
                          <a
                            className="btn btn-sm btn-outline-primary"
                            href={`${LOCATION_APP_URL}/edit/${workorder.locationId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Location
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{workorder.createdDate ? new Date(workorder.createdDate).toLocaleString() : '-'}</td>
                      <td>
                        <Link to={`/edit/${workorder.id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(workorder.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={() => setPage(Math.max(page - 1, 0))}
                  disabled={page === 0}
                >
                  Prev
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setPage(Math.min(page + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1 || totalPages === 0}
                >
                  Next
                </button>
              </div>
              <div>
                Page {page + 1} of {totalPages || 1}
              </div>
              <div>
                <select
                  className="form-select"
                  value={size}
                  onChange={(e) => {
                    setSize(Number(e.target.value));
                    setPage(0);
                  }}
                >
                  {[5, 10, 20, 50].map(s => (
                    <option key={s} value={s}>{s} / page</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkorderList;
