// Y2KProjectModal.js
// Modal for displaying project details and media in the Y2K/Win95 UI
// Used only in the Y2K/Win95 view, not in the terminal view

import React from 'react';

// Styles for the modal backdrop, window, title bar, and buttons
const modalBackdrop = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(60, 60, 80, 0.25)',
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalWindow = {
  background: '#f0f0f0',
  border: '2.5px solid #fff',
  borderBottom: '2.5px solid #888',
  borderRight: '2.5px solid #888',
  borderRadius: 0,
  boxShadow: '6px 6px 0 #888',
  width: 'auto',
  minWidth: 320,
  maxWidth: '90vw',
  minHeight: 120,
  maxHeight: '90vh',
  overflow: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch', // Make children stretch
  justifyContent: 'center',
};

const titleBar = {
  background: 'linear-gradient(90deg, #0a246a 80%, #3a6ea5 100%)',
  color: '#fff',
  padding: '7px 10px',
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  borderBottom: '2px solid #888',
  letterSpacing: 1,
  userSelect: 'none',
  width: '100%', // Ensure the title bar stretches the full modal width
  boxSizing: 'border-box',
};

const winIcon = {
  width: 20,
  height: 20,
  marginRight: 8,
  display: 'inline-block',
};

const closeBtn = {
  marginLeft: 'auto',
  background: '#c3c7cb',
  border: '1.5px solid #888',
  borderRadius: 0,
  width: 20,
  height: 20,
  color: '#222',
  fontWeight: 'bold',
  fontSize: 16,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 1px 1px 0 #fff',
  transition: 'background 0.15s',
};

const modalContent = {
  padding: '18px 20px 20px 20px',
  color: '#222',
  fontFamily: 'Tahoma, Verdana, Geneva, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  zIndex: 1, // Ensure content is below header
};

/**
 * Y2KModal component for displaying content in a modal window.
 * @param {Object} props - Component properties
 * @param {boolean} props.open - Determines if the modal is open
 * @param {string} props.title - Title of the modal
 * @param {function} props.onClose - Function to call when the modal should be closed
 * @param {ReactNode} props.children - Content to display inside the modal
 * @returns {JSX.Element|null} Rendered modal component or null
 */
function Y2KModal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div style={modalBackdrop}>
      <div style={modalWindow}>
        <div style={{ ...titleBar, zIndex: 2, position: 'relative' }}>
          <span style={winIcon}>
            <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" fill="#fff" stroke="#0a246a" strokeWidth="2"/><rect x="4" y="4" width="10" height="10" fill="#3a6ea5"/></svg>
          </span>
          {title || 'Popup'}
          <button style={closeBtn} onClick={onClose} title="Close">×</button>
        </div>
        <div style={modalContent}>{children}</div>
      </div>
    </div>
  );
}

export default Y2KModal;
