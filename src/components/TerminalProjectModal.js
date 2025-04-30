// TerminalProjectModal.js
// Modal for displaying project details in the terminal UI (green/black theme)
// Used only in the terminal view, not in the Y2K/Win95 view

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const modalBg = {
  background: 'rgba(0,0,0,0.7)',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#000',
  color: '#0f0',
  padding: 24,
  borderRadius: 8,
  maxWidth: 420,
  width: '95vw',
  position: 'relative',
  fontFamily: 'Courier New, monospace',
  border: '2px solid #0f0',
  boxShadow: '0 0 32px #0f08',
  maxHeight: '80vh',
  overflowY: 'auto',
};

const closeBtnStyle = {
  position: 'absolute',
  top: 8,
  right: 8,
  fontSize: 22,
  background: 'none',
  border: 'none',
  color: '#0f0',
  cursor: 'pointer',
  transition: 'transform 0.15s',
};

const linkStyle = {
  color: '#0f0',
  textDecoration: 'underline',
  cursor: 'pointer',
};

/**
 * ProjectModal component to display project details
 * @param {Object} project - Project object containing details to display
 * @param {Function} onClose - Function to call to close the modal
 * @param {Function} onShowMedia - Function to call to show media related to the project
 * @returns {JSX.Element|null} - Returns modal JSX or null if no project is selected
 */
const ProjectModal = ({ project, onClose, onShowMedia }) => {
  if (!project) return null;
  const hasMedia = project.body && project.body.some(item => item.tag === 'img' || item.tag === 'video');
  return (
    <div style={modalBg}>
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={closeBtnStyle}
          aria-label="Close"
        >✕</button>
        <h2 style={{ color: '#0f0', marginBottom: 8 }}>{project.name}</h2>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Stack:</strong> {project.stack}</p>
        <p><strong>Language:</strong> {project.language}</p>
        <div style={{ marginBottom: 8 }}><strong>Collaborators:</strong> {project.collaborators.map((c, i) => (
          <a key={i} href={c.link} target="_blank" rel="noopener noreferrer" style={{ ...linkStyle, marginRight: 8 }}>
            {c.name || c.link}
          </a>
        ))}</div>
        {hasMedia && (
          <button
            style={{ ...closeBtnStyle, position: 'static', marginTop: 12, marginBottom: 0, width: 'auto', height: 'auto', fontSize: 16, padding: '4px 16px', background: '#111', color: '#0f0', border: '1px solid #0f0' }}
            onClick={onShowMedia}
          >
            View Media
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
