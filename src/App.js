import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import { motion } from 'framer-motion';
import Terminal from './components/Terminal';
import Y2KPage from './components/Y2KPage';
import TerminalProjectModal from './components/TerminalProjectModal';
import Y2KProjectModal from './components/Y2KProjectModal';
import './App.css';
import { aboutData, contactData } from './aboutContactData';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Terminal state for scrollback/history and input buffer
  const [terminalHistory, setTerminalHistory] = useState([
    'Welcome to the terminal interface!',
    'Available commands: about, projects, contact',
  ]);
  const [inputBuffer, setInputBuffer] = useState('');
  const [pendingRoute, setPendingRoute] = useState(null);
  // Modal for terminal UI (green/black style)
  const [modalProject, setModalProject] = useState(null);
  const [viewMode, setViewMode] = useState('terminal'); // 'terminal' or 'y2k'
  const [loading, setLoading] = useState(false); // <-- loading state for animation
  const [showWelcome, setShowWelcome] = useState(true); // Show welcome modal on launch

  // Utility to convert React node to plain text for terminal display
  function getRouteContentText(pathname) {
    switch (pathname) {
      case '/about':
        return [
          '[img:head.gif]',
          'About Me',
          `Name: ${aboutData.name}`,
          `Role: ${aboutData.role}`,
          `Bio: ${aboutData.bio}`
        ];
      case '/projects':
        return [
          'Projects',
          'Rendering projects list... (Check UI for details)',
        ];
      case '/contact':
        return [
          'Contact',
          `Email: ${contactData.email}`,
          `LinkedIn: ${contactData.linkedin.label}`
        ];
      default:
        return [];
    }
  }

  const [animatedRoute, setAnimatedRoute] = useState(null);

  // Animate route content line by line
  React.useEffect(() => {
    if (pendingRoute) {
      const lines = getRouteContentText(pendingRoute);
      if (lines.length > 0) {
        setAnimatedRoute({ lines, index: 0 });
      }
      setPendingRoute(null);
    }
  }, [pendingRoute]);

  React.useEffect(() => {
    if (animatedRoute && animatedRoute.index < animatedRoute.lines.length) {
      const timeout = setTimeout(() => {
        setTerminalHistory((prev) => [...prev, animatedRoute.lines[animatedRoute.index]]);
        setAnimatedRoute((prev) => ({ ...prev, index: prev.index + 1 }));
      }, 300); // Adjust speed here
      return () => clearTimeout(timeout);
    }
  }, [animatedRoute, setTerminalHistory]);

  // Handle command from terminal
  const handleCommand = useCallback(async (input) => {
    const command = input.toLowerCase().trim();
    if (command === 'help') {
      setTerminalHistory(prev => [
        ...prev,
        'Available commands:',
        "about   - Learn more about me",
        "projects - List my projects (click for details)",
        "contact - Get my contact info",
        "help    - Show this help message",
        "clear   - Clear the terminal output"
      ]);
      setInputBuffer('');
      return;
    }
    if (command === 'clear') {
      setTerminalHistory([]);
      setInputBuffer('');
      return;
    }
    if (command === 'projects') {
      setTerminalHistory((prev) => [...prev, `$ ${input}`, 'Fetching projects']);
      let blink = true;
      let blinkInterval = setInterval(() => {
        setTerminalHistory((prev) => {
          const last = prev[prev.length - 1];
          if (typeof last === 'string' && last.startsWith('Fetching projects')) {
            return [...prev.slice(0, -1), `Fetching projects${blink ? '.' : '...'}`];
          }
          return prev;
        });
        blink = !blink;
      }, 500);
      try {
        const response = await fetch('https://5p61nj9kc8.execute-api.us-east-1.amazonaws.com/getAll');
        const data = await response.json();
        clearInterval(blinkInterval);
        setTerminalHistory((prev) => [
          ...prev.filter(line => !(typeof line === 'string' && line.startsWith('Fetching projects'))),
          'Projects:',
          <div key="click-msg" style={{ color: '#0f0', marginBottom: 4 }}>Click a project below to view more details.</div>,
          ...data.Items.map((project, idx) => (
            <span key={project.project_id} style={{ color: '#0f0', cursor: 'pointer' }} onClick={() => setModalProject(project)}>
              {idx + 1}. {project.name} - {project.description}
            </span>
          ))
        ]);
      } catch (err) {
        clearInterval(blinkInterval);
        setTerminalHistory((prev) => [
          ...prev.filter(line => !(typeof line === 'string' && line.startsWith('Fetching projects'))),
          `Error fetching projects: ${err.message}`
        ]);
      }
      setInputBuffer('');
      return;
    } else if (["about", "contact"].includes(command)) {
      navigate(`/${command}`);
      const output = `Navigating to ${command}...`;
      setPendingRoute(`/${command}`);
      setTerminalHistory((prev) => [...prev, `$ ${input}`, output]);
    } else if (command) {
      const output = `Command not found: ${command}`;
      setTerminalHistory((prev) => [...prev, `$ ${input}`, output]);
    } else {
      setTerminalHistory((prev) => [...prev, `$ ${input}`]);
    }
    setInputBuffer('');
  }, [navigate]);

  // Handle terminal key input
  const handleInput = useCallback((value) => {
    setInputBuffer(value);
  }, []);

  // Handle output from parent (for compatibility)
  React.useEffect(() => {
    const handleOutput = (e) => {
      if (e.detail && e.detail.output) {
        setTerminalHistory((prev) => [...prev, e.detail.output]);
      }
    };
    window.addEventListener('terminal-output', handleOutput);
    return () => window.removeEventListener('terminal-output', handleOutput);
  }, []);

  // Switch view handlers
  const handleSwitchToY2K = () => {
    setLoading(true);
    setTimeout(() => {
      setViewMode('y2k');
      setLoading(false);
    }, 900); // Animation duration
  };
  const handleSwitchToTerminal = () => {
    setLoading(true);
    setTimeout(() => {
      setViewMode('terminal');
      setLoading(false);
    }, 900);
  };
  const handleY2KNavigate = (section) => {
    setViewMode('y2k');
    navigate('/' + section);
    setPendingRoute('/' + section); // For animated terminal effect if user switches back
  };

  const typedHeader = React.useMemo(() => (
    <ReactTyped
      strings={
        [
          "Welcome to Cordell's Portfolio",
          "Type 'about' to learn more",
          "Type 'projects' to see my work",
          "Type 'contact' to get in touch"
        ]}
      typeSpeed={40}
      backSpeed={50}
      loop
    />
  ), []);

  if (loading) {
    // AOL-style loading overlay
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: viewMode === 'y2k' ? '#e9e9e9' : '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'Tahoma, Verdana, Geneva, sans-serif',
        color: viewMode === 'y2k' ? '#0a246a' : '#0f0',
        fontSize: 32,
        letterSpacing: 1,
        transition: 'background 0.3s',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* AOL Logo */}
          <svg width="90" height="90" viewBox="0 0 90 90" style={{ marginBottom: 18 }}>
            <polygon points="45,10 80,80 10,80" fill={viewMode === 'y2k' ? '#0a246a' : '#0f0'} stroke="#888" strokeWidth="3" />
            <circle cx="45" cy="50" r="10" fill={viewMode === 'y2k' ? '#e9e9e9' : '#000'} stroke={viewMode === 'y2k' ? '#0a246a' : '#0f0'} strokeWidth="3" />
          </svg>
          <div style={{ fontWeight: 'bold', fontSize: 36, marginBottom: 8 }}>Welcome</div>
          <div style={{ fontSize: 22, marginBottom: 18 }}>America Online</div>
          <div style={{ fontSize: 20, marginBottom: 18 }}>
            Loading<span className="aol-dots">{Array.from({length: 3}).map((_,i) => <span key={i} style={{ opacity: 1, animation: `aol-dot-blink 1s ${(i*0.2)}s infinite` }}>.</span>)}</span>
          </div>
          {/* AOL-style progress bar */}
          <div style={{ width: 220, height: 12, background: viewMode === 'y2k' ? '#fff' : '#222', border: `1.5px solid ${viewMode === 'y2k' ? '#0a246a' : '#0f0'}`, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              style={{ height: '100%', background: viewMode === 'y2k' ? '#0a246a' : '#0f0' }}
            />
          </div>
          <div style={{ fontSize: 15, opacity: 0.7 }}>Connecting...</div>
          <style>{`
            @keyframes aol-dot-blink {
              0%, 80%, 100% { opacity: 1; }
              40% { opacity: 0; }
            }
          `}</style>
        </motion.div>
      </div>
    );
  }

  if (showWelcome) {
    // Y2K-styled welcome modal
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'url(' + process.env.PUBLIC_URL + '/vapor_sky.jpg) center center / cover no-repeat fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}>
        <div style={{
          background: '#f0f0f0',
          border: '2.5px solid #fff',
          borderBottom: '2.5px solid #888',
          borderRight: '2.5px solid #888',
          boxShadow: '6px 6px 0 #888',
          width: 420,
          maxWidth: '95vw',
          padding: 0,
          borderRadius: 0,
          fontFamily: 'Tahoma, Verdana, Geneva, sans-serif',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #0a246a 80%, #3a6ea5 100%)',
            color: '#fff',
            padding: '10px 16px',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            borderBottom: '2px solid #888',
            letterSpacing: 1,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{ width: 20, height: 20, marginRight: 8, display: 'inline-block' }}>
              <svg width="18" height="18" viewBox="0 0 18 18"><rect x="2" y="2" width="14" height="14" fill="#fff" stroke="#0a246a" strokeWidth="2"/><rect x="4" y="4" width="10" height="10" fill="#3a6ea5"/></svg>
            </span>
            Welcome
          </div>
          <div style={{ padding: '28px 28px 24px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.15rem', color: '#0a246a', marginBottom: 18 }}>
              Welcome Cordell's Portfolio!<br />
              Please select a view to begin:
            </div>
            <button
              style={{
                margin: '12px 0',
                width: '100%',
                padding: '10px 0',
                background: 'linear-gradient(90deg, #fff 60%, #e9e9e9 100%)',
                border: '2px outset #b0b0b0',
                borderRadius: 2,
                color: '#0a246a',
                fontWeight: 'bold',
                fontSize: '1.05rem',
                boxShadow: '0 1px 0 #fff',
                cursor: 'pointer',
                transition: 'background 0.2s, box-shadow 0.2s',
                marginBottom: 10,
              }}
              onClick={() => { setViewMode('y2k'); setShowWelcome(false); }}
            >
              Minimalist View
            </button>
            <button
              style={{
                margin: '12px 0',
                width: '100%',
                padding: '10px 0',
                background: 'linear-gradient(90deg, #fff 60%, #e9e9e9 100%)', // Match Y2K button
                border: '2px outset #b0b0b0',
                borderRadius: 2,
                color: '#0a246a',
                fontWeight: 'bold',
                fontSize: '1.05rem',
                boxShadow: '0 1px 0 #fff',
                cursor: 'pointer',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
              onClick={() => { setViewMode('terminal'); setShowWelcome(false); }}
            >
              Terminal View
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'y2k') {
    // Render the Y2K/Win95 style page
    return (
      <Y2KPage
        onSwitchToTerminal={handleSwitchToTerminal}
        onNavigate={handleY2KNavigate}
      />
    );
  }

  return (
    <div className="App">
      {/* Terminal UI header and terminal */}
      <header className="App-header">
        <img src={process.env.PUBLIC_URL + '/giphy.gif'} alt="Profile Gif" style={{ width: '300px', display: 'block', margin: '0 auto 16px auto', borderRadius: '8px' }} />
        {typedHeader}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{ width: '100%', maxWidth: 600 }}
          >
            <Terminal
              onCommand={handleCommand}
              history={terminalHistory}
              inputBuffer={inputBuffer}
              onInputBufferChange={handleInput}
            />
          </motion.div>
        </div>
        {/* Terminal-style project modal (green/black) */}
        <TerminalProjectModal project={modalProject} onClose={() => setModalProject(null)} />
        {/* Subtle link to Y2K view */}
        <div style={{ position: 'fixed', bottom: 12, right: 18, fontSize: '0.95rem', color: '#0f0', opacity: 0.5, textDecoration: 'underline', cursor: 'pointer', zIndex: 10 }} onClick={handleSwitchToY2K}>
          Y2K Mode
        </div>
      </header>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;
