import React from 'react';

/**
 * Custom hook to persist filters in localStorage.
 * 
 * @param {string} key - Unique storage key (e.g., 'asset-filters')
 * @param {object} initialFilters - Default filter values
 * @returns {object} - { filters, setFilters, clearFilters, hasActiveFilters }
 */
export function usePersistedFilters(key, initialFilters) {
  const storageKey = `restoam-${key}`;

  // Load from localStorage or use initial
  const loadFilters = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load filters from localStorage:', e);
    }
    return initialFilters;
  };

  const [filters, setFiltersState] = React.useState(loadFilters);

  // Save to localStorage on change
  const setFilters = (newFilters) => {
    setFiltersState(newFilters);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newFilters));
    } catch (e) {
      console.warn('Failed to save filters to localStorage:', e);
    }
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      const initial = initialFilters[key];
      return value !== initial && value !== '' && value !== null && value !== undefined;
    });
  };

  return { filters, setFilters, clearFilters, hasActiveFilters };
}
