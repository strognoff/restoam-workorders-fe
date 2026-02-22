import React from 'react';
import { Link } from 'react-router-dom';

/**
 * EmptyState component for list views.
 * Shows different content based on whether the list is empty due to no records or filters.
 * 
 * @param {boolean} hasFilters - Whether any filters are currently active
 * @param {function} onClearFilters - Callback to clear all filters
 * @param {string} entityName - Name of the entity (e.g., "Asset", "Location", "Workorder")
 * @param {string} createPath - Path to the create form (e.g., "/add")
 */
function EmptyState({ hasFilters, onClearFilters, entityName, createPath }) {
  if (hasFilters) {
    // No results due to filters
    return (
      <div className="text-center py-5">
        <div className="mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </div>
        <h5 className="text-muted mb-2">No {entityName}s Found</h5>
        <p className="text-muted mb-3">No results match your current filters.</p>
        <button className="btn btn-outline-primary" onClick={onClearFilters}>
          Clear Filters
        </button>
      </div>
    );
  }

  // Truly no records
  return (
    <div className="text-center py-5">
      <div className="mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="text-muted" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </div>
      <h5 className="text-muted mb-2">No {entityName}s Yet</h5>
      <p className="text-muted mb-3">Get started by creating your first {entityName.toLowerCase()}.</p>
      <Link to={createPath} className="btn btn-primary">
        Create {entityName}
      </Link>
    </div>
  );
}

export default EmptyState;
