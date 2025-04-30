// Y2KPage.js
// Main Y2K/Win95-inspired landing page for the portfolio
// Handles About, Contact, and Projects sections, and uses Y2KProjectModal for project details
// All UI here is styled to look like a 90s OS popup window

import React, { useEffect, useState } from 'react';
import Y2KProjectModal from './Y2KProjectModal';
import { aboutData, contactData } from '../aboutContactData';

const win95Bg = {
  minHeight: '100vh',
  background: `url(${process.env.PUBLIC_URL + '/vapor_sky.jpg'}) center center / cover no-repeat fixed`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Tahoma, Verdana, Geneva, sans-serif',
};

const win95Window = {
  background: '#f0f0f0',
  border: '2.5px solid #fff',
  borderBottom: '2.5px solid #888',
  borderRight: '2.5px solid #888',
  borderRadius: 0,
  boxShadow: '6px 6px 0 #888',
  width: 420,
  maxWidth: '95vw',
  paddingBottom: 24,
  overflow: 'hidden',
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
};

const winIcon = {
  width: 20,
  height: 20,
  marginRight: 8,
  display: 'inline-block',
};

const winBtns = {
  marginLeft: 'auto',
  display: 'flex',
  gap: 3,
};

const winBtn = {
  width: 16,
  height: 16,
  background: '#c3c7cb',
  border: '1.5px solid #888',
  borderRadius: 0,
  marginLeft: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  color: '#222',
  boxShadow: 'inset 1px 1px 0 #fff',
};

const sectionHeader = {
  fontFamily: 'Tahoma, Verdana, Geneva, sans-serif',
  fontSize: '1.1rem',
  color: '#0a246a',
  margin: '22px 0 8px 0',
  letterSpacing: 1,
  borderBottom: '1px solid #b0b0b0',
  paddingBottom: 2,
  textAlign: 'left',
};

const aboutText = {
  color: '#222',
  fontSize: '1.01rem',
  margin: '0 0 12px 0',
  lineHeight: 1.5,
};

const contactBox = {
  background: '#e9e9e9',
  border: '1.5px solid #b0b0b0',
  borderRadius: 2,
  padding: '10px 16px',
  margin: '0 0 18px 0',
  color: '#0a246a',
  fontSize: '1.01rem',
};

const projectList = {
  margin: '0 0 0 0',
  padding: 0,
  listStyle: 'none',
};

const projectLink = {
  display: 'block',
  margin: '10px 0',
  padding: '8px 0',
  background: 'linear-gradient(90deg, #fff 60%, #e9e9e9 100%)',
  border: '2px outset #b0b0b0',
  borderRadius: 2,
  color: '#0a246a',
  fontWeight: 'bold',
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: '1.01rem',
  boxShadow: '0 1px 0 #fff',
  cursor: 'pointer',
  transition: 'background 0.2s, box-shadow 0.2s',
};

const subtleLink = {
  position: 'fixed',
  bottom: 12,
  right: 18,
  fontSize: '0.95rem',
  color: '#0a246a',
  opacity: 0.6,
  textDecoration: 'underline',
  cursor: 'pointer',
  zIndex: 10,
};

const projectsApi = 'https://5p61nj9kc8.execute-api.us-east-1.amazonaws.com/getAll';

function Y2KLanding({ onSwitchToTerminal }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [modalProject, setModalProject] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const pageSize = 3;

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(projectsApi);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data.Items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const totalPages = Math.ceil(projects.length / pageSize);
  const pagedProjects = projects.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div style={win95Bg}>
      <div style={win95Window}>
        <div style={titleBar}>
          <span style={winIcon}>
            {/* Windows 95 style icon */}
            <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" fill="#fff" stroke="#0a246a" strokeWidth="2"/><rect x="4" y="4" width="10" height="10" fill="#3a6ea5"/></svg>
          </span>
          Cordell's Portfolio
          <span style={winBtns}>
            <span style={winBtn} title="Minimize">_</span>
            <span style={winBtn} title="Maximize">▢</span>
            <span style={winBtn} title="Close">×</span>
          </span>
        </div>
        <div style={{ padding: '22px 22px 0 22px' }}>
          <div style={sectionHeader}>About Me</div>
          <div style={aboutText}>
            <strong>Name:</strong> {aboutData.name}<br />
            <strong>Role:</strong> {aboutData.role}<br />
            <strong>Bio:</strong> {aboutData.bio}
          </div>
          <div style={sectionHeader}>Contact</div>
          <div style={contactBox}>
            <div><strong>Email:</strong> {contactData.email}</div>
            <div><strong>LinkedIn:</strong> <a href={contactData.linkedin.url} style={{ color: '#0a246a', textDecoration: 'underline' }}>{contactData.linkedin.label}</a></div>
          </div>
          <div style={sectionHeader}>Projects</div>
          {loading && (
            <div style={{ color: '#0a246a', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'inline-block', width: 22, height: 22 }}>
                <span style={{
                  display: 'inline-block',
                  width: 22,
                  height: 22,
                  border: '3px solid #b0b0b0',
                  borderTop: '3px solid #0a246a',
                  borderRadius: '50%',
                  animation: 'y2k-spin 1s linear infinite',
                  boxSizing: 'border-box',
                }} />
                <style>{`
                  @keyframes y2k-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </span>
              Loading projects...
            </div>
          )}
          {error && <div style={{ color: 'red', fontSize: '0.98rem' }}>Error: {error}</div>}
          <ul style={projectList}>
            {!loading && !error && pagedProjects.map((proj, i) => (
              <li key={proj.project_id || i}>
                <a
                  href="#"
                  style={projectLink}
                  tabIndex={0}
                  onClick={e => {
                    e.preventDefault();
                    setModalProject(proj);
                    setShowMediaModal(false);
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{proj.name}</div>
                  <div style={{ fontSize: '0.97rem', color: '#0a246a', fontWeight: 'normal' }}>{proj.description}</div>
                </a>
              </li>
            ))}
          </ul>
          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '10px 0 0 0' }}>
              <button
                style={{ ...projectLink, width: 80, padding: '6px 0', fontSize: '0.98rem' }}
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Prev
              </button>
              <span style={{ alignSelf: 'center', color: '#0a246a', fontSize: '0.98rem' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                style={{ ...projectLink, width: 80, padding: '6px 0', fontSize: '0.98rem' }}
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Use Y2KProjectModal for project details */}
      <Y2KProjectModal
        open={!!modalProject && !showMediaModal}
        title={modalProject ? modalProject.name : ''}
        onClose={() => setModalProject(null)}
      >
        {modalProject && (
          <div>
            <div style={{ marginBottom: 8, color: '#0a246a' }}><strong>Description:</strong> {modalProject.description}</div>
            {modalProject.stack && <div style={{ marginBottom: 8 }}><strong>Stack:</strong> {modalProject.stack}</div>}
            {modalProject.language && <div style={{ marginBottom: 8 }}><strong>Language:</strong> {modalProject.language}</div>}
            {modalProject.collaborators && modalProject.collaborators.length > 0 && (
              <div style={{ marginBottom: 8 }}><strong>Collaborators:</strong> {modalProject.collaborators.map((c, i) => (
                <span key={i} style={{ marginRight: 8 }}>{c.name || c.link}</span>
              ))}</div>
            )}
            {/* Show button to open media modal if media exists */}
            {modalProject.body && modalProject.body.some(item => item.tag === 'img' || item.tag === 'video') && (
              <button
                style={{ marginTop: 12, marginBottom: 0, width: 'auto', height: 'auto', fontSize: 16, padding: '4px 16px', background: '#e9e9e9', color: '#0a246a', border: '2px outset #b0b0b0', cursor: 'pointer' }}
                onClick={() => setShowMediaModal(true)}
              >
                View Media
              </button>
            )}
          </div>
        )}
      </Y2KProjectModal>
      <Y2KProjectModal
        open={!!modalProject && showMediaModal}
        title={modalProject ? `${modalProject.name} Media` : ''}
        onClose={() => setShowMediaModal(false)}
      >
        {modalProject && modalProject.body && Array.isArray(modalProject.body) && (
          <div style={{
            maxHeight: '60vh',
            overflowY: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {modalProject.body.filter(item => item.tag === 'img' || item.tag === 'video').map((item, i) => {
              if (item.tag === 'img') return <img key={i} src={item.value} alt="project" style={{ display: 'block', margin: '12px auto', maxWidth: '100%', maxHeight: '50vh', height: 'auto', objectFit: 'contain' }} />;
              if (item.tag === 'video') return <video key={i} src={item.value} controls style={{ display: 'block', margin: '12px auto', maxWidth: '100%', maxHeight: '50vh', height: 'auto', objectFit: 'contain' }} />;
              return null;
            })}
          </div>
        )}
      </Y2KProjectModal>
      <div style={subtleLink} onClick={onSwitchToTerminal}>
        Terminal Mode
      </div>
    </div>
  );
}

export default Y2KLanding;