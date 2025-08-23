import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './components/ProjectForm';
import Dashboard from './pages/DashBoard';
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
            <Route path="/new-project" element={
              <div className="page-container">
                <h1>Create New Project</h1>
                <ProjectForm onSubmit={(newProject) => {
                  console.log('New project:', newProject);
                  window.location.href = '/projects';
                }} />
              </div>
            } />
            <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
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

// Add this new component for editing projects
function ProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/projects/${id}`)
      .then(response => response.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (updatedProject) => {
    fetch(`http://localhost:3000/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProject)
    })
    .then(response => {
      if (response.ok) {
        navigate(`/projects/${id}`);
      }
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="page-container">
      <h1>Edit Project</h1>
      <ProjectForm 
        project={project}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;