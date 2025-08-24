import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import Dashboard from './pages/DashBoard';
import ProjectEdit from './pages/ProjectEdit';
import { useState } from 'react';

// Create a wrapper component to handle the form submission with navigation
function NewProjectPage() {
  const navigate = useNavigate();
  const [refreshFlag, setRefreshFlag] = useState(false);

  const handleSubmit = async (newProject) => {
    try {
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      // Navigate back to projects list with refresh state
      navigate('/projects', { state: { refresh: true } });
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  };

  return (
    <div className="page-container">
      <h1>Create New Project</h1>
      <ProjectForm onSubmit={handleSubmit} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/new-project" element={<NewProjectPage />} />
            <Route path="/projects/:id/edit" element={<ProjectEdit />} />
            <Route path="*" element={
              <div className="not-found-container">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <button onClick={() => window.location.href = '/projects'}>
                  Go to Projects
                </button>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;