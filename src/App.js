import React, { useCallback, useState } from 'react';
import { BrowserRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import { motion } from 'framer-motion';
import Terminal from './components/Terminal';
import './App.css';

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

  // Utility to convert React node to plain text for terminal display
  function getRouteContentText(pathname) {
    switch (pathname) {
      case '/about':
        return [
          '[img:head.gif]',
          'About Me',
          'Name: Jane Doe',
          'Role: Full Stack Developer',
          'Bio: Passionate about building modern web applications and AI integrations.'
        ];
      case '/projects':
        return [
          'Projects',
          'Project Alpha - AI Portfolio Website',
          'Project Beta - Blog Platform',
          'Project Gamma - E-commerce Dashboard'
        ];
      case '/contact':
        return [
          'Contact',
          'Email: jane.doe@example.com',
          'LinkedIn: linkedin.com/in/janedoe'
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
  const handleCommand = useCallback((input) => {
    const command = input.toLowerCase().trim();
    let output = '';
    if (["about", "projects", "contact"].includes(command)) {
      navigate(`/${command}`);
      output = `Navigating to ${command}...`;
      setPendingRoute(`/${command}`);
    } else if (command) {
      output = `Command not found: ${command}`;
    }
    if (output) {
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

  return (
    <div className="App">
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
