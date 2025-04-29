import React from 'react';

const PROMPT = '$ ';

const Terminal = ({ onCommand, history = [], inputBuffer = '', onInputBufferChange }) => {
  const inputRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Use layout effect to ensure scroll happens after DOM updates
  React.useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  });

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  const handleInputChange = (e) => {
    onInputBufferChange(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onCommand(inputBuffer);
    }
  };

  return (
    <div ref={containerRef} style={{ height: '400px', background: '#000', color: '#0f0', padding: 10, overflowY: 'auto', fontFamily: 'Courier New, monospace' }}>
      {history.map((line, idx) => {
        if (typeof line === 'string' && line.startsWith('[img:') && line.endsWith(']')) {
          const imgName = line.slice(5, -1);
          return (
            <div key={idx} style={{ textAlign: 'center', margin: '12px 0' }}>
              <img src={process.env.PUBLIC_URL + '/' + imgName} alt={imgName} style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
            </div>
          );
        }
        return <div key={idx}>{line}</div>;
      })}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
        <span style={{ color: '#0f0' }}>{PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          value={inputBuffer}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#0f0',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            flex: 1,
            marginLeft: 4
          }}
          autoFocus
        />
      </div>
    </div>
  );
};

export default Terminal;