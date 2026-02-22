import React, { useState } from 'react';

/**
 * A reusable component to display an ID with copy-to-clipboard functionality.
 * Shows a confirmation toast when copied.
 * 
 * @param {string} id - The ID value to display and copy
 * @param {string} label - Optional label text (defaults to "ID")
 */
function CopyIdField({ id, label = 'ID' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!id) return;
    
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = id;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error('Failed to copy:', e);
      }
      document.body.removeChild(textArea);
    }
  };

  if (!id) return null;

  return (
    <div className="col-12">
      <label className="form-label">{label}</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control font-monospace"
          value={id}
          readOnly
          style={{ 
            backgroundColor: '#f8f9fa',
            cursor: 'default'
          }}
        />
        <button
          type="button"
          className={`btn ${copied ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
              </svg>
              <span className="ms-1">Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
              </svg>
              <span className="ms-1">Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default CopyIdField;
