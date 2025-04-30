import React, { useEffect, useState } from 'react';

function Projects({ onFetchComplete }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('https://5p61nj9kc8.execute-api.us-east-1.amazonaws.com/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.Items);
        if (onFetchComplete) {
          const projectNames = data.Items.map((project) => `- ${project.name}: ${project.description}`);
          onFetchComplete(projectNames);
        }
      } catch (err) {
        setError(err.message);
        if (onFetchComplete) {
          onFetchComplete([`Error: ${err.message}`]);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [onFetchComplete]);

  if (loading) {
    return null; // No UI rendering, handled by terminal
  }

  if (error) {
    return null; // No UI rendering, handled by terminal
  }

  return null; // No UI rendering, handled by terminal
}

export default Projects;
