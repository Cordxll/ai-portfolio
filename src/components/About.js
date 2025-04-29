import React from 'react';

function About() {
  return (
    <div>
      <h2>About Me</h2>
      <img src={process.env.PUBLIC_URL + '/head.gif'} alt="Profile Gif" style={{ width: '300px', display: 'block', margin: '0 auto 16px auto', borderRadius: '8px' }} />
      <p>Name: Cordell</p>
      <p>Role: Full Stack Developer</p>
      <p>Bio: Passionate about building modern web applications and AI integrations.</p>
      
    </div>
  );
}

export default About;
