import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import WorkorderList from './components/WorkorderList';
import AddWorkorder from './components/AddWorkorder';
import EditWorkorder from './components/EditWorkorder';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">RestoAM Workorders</Link>
            <div className="navbar-nav">
              <Link className="nav-link" to="/">Workorders</Link>
              <Link className="nav-link" to="/add">Add Workorder</Link>
              <a className="nav-link" href={import.meta.env.VITE_ASSET_APP_URL || 'http://localhost:5173'} target="_blank" rel="noreferrer">Assets</a>
              <a className="nav-link" href={import.meta.env.VITE_LOCATION_APP_URL || 'http://localhost:5174'} target="_blank" rel="noreferrer">Locations</a>
            </div>
          </div>
        </nav>

        <main className="container py-4">
          <Routes>
            <Route path="/" element={<WorkorderList />} />
            <Route path="/add" element={<AddWorkorder />} />
            <Route path="/edit/:id" element={<EditWorkorder />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
