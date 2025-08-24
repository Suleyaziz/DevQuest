import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import './ProjectList.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchProjects();
    }, []);

    // Listen for refresh trigger from navigation state
    useEffect(() => {
        if (location.state?.refresh) {
            fetchProjects();
            // Clear the navigation state to prevent infinite refreshes
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    const fetchProjects = () => {
        setLoading(true);
        fetch("http://localhost:3000/projects")
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const projectsWithProgress = data.map(project => ({
                    ...project,
                    progress: calculateProjectProgress(project)
                }));
                setProjects(projectsWithProgress);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to fetch projects:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const calculateProjectProgress = (project) => {
        if (!project.tasks || project.tasks.length === 0) return 0;
        const completedTasks = project.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / project.tasks.length) * 100);
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            fetch(`http://localhost:3000/projects/${projectId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    // Remove the project from local state immediately
                    setProjects(prev => prev.filter(p => p.id !== projectId));
                } else {
                    throw new Error('Failed to delete project');
                }
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to delete project:", err);
                // Refetch to ensure we have the latest data
                fetchProjects();
            });
        }
    };

    const filteredProjects = projects.filter(project => {
        if (filter === 'all') return true;
        return project.status === filter;
    });

    const handleViewDetails = (project) => {
        navigate(`/projects/${project.id}`);
    };

    const handleEditProject = (project) => {
        navigate(`/projects/${project.id}/edit`);
    };

    const handleRefresh = () => {
        fetchProjects();
    };

    if (loading) {
        return (
            <div className="project-list-container">
                <div className="loading">Loading projects...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-list-container">
                <div className="error">
                    <h2>Error Loading Projects</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchProjects} className="retry-btn">
                            Try Again
                        </button>
                        <button onClick={() => navigate('/new-project')} className="create-btn">
                            Create New Project
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="project-list-container">
            <div className="project-list-header">
                <div className="header-left">
                    <h1>My Projects</h1>
                    <span className="projects-count">({projects.length} total)</span>
                </div>
                <div className="header-right">
                    <button 
                        className="refresh-btn"
                        onClick={handleRefresh}
                        title="Refresh projects"
                    >
                        ↻
                    </button>
                    <button 
                        className="create-project-btn"
                        onClick={() => navigate('/new-project')}
                    >
                        + New Project
                    </button>
                </div>
            </div>
            
            <div className="project-filters">
                <button 
                    className={filter === 'all' ? 'active' : ''} 
                    onClick={() => setFilter('all')}
                >
                    All Projects ({projects.length})
                </button>
                <button 
                    className={filter === 'in-progress' ? 'active' : ''} 
                    onClick={() => setFilter('in-progress')}
                >
                    In Progress ({projects.filter(p => p.status === 'in-progress').length})
                </button>
                <button 
                    className={filter === 'completed' ? 'active' : ''} 
                    onClick={() => setFilter('completed')}
                >
                    Completed ({projects.filter(p => p.status === 'completed').length})
                </button>
                <button 
                    className={filter === 'not-started' ? 'active' : ''} 
                    onClick={() => setFilter('not-started')}
                >
                    Not Started ({projects.filter(p => p.status === 'not-started').length})
                </button>
            </div>

            <div className="projects-grid">
                {filteredProjects.length === 0 ? (
                    <div className="no-projects">
                        <p>No projects found{filter !== 'all' ? ` with status "${filter}"` : ''}.</p>
                        {filter !== 'all' && (
                            <button 
                                onClick={() => setFilter('all')}
                                className="clear-filter-btn"
                            >
                                Show all projects
                            </button>
                        )}
                        {projects.length === 0 && (
                            <button 
                                onClick={() => navigate('/new-project')}
                                className="create-first-btn"
                            >
                                Create your first project
                            </button>
                        )}
                    </div>
                ) : (
                    filteredProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onViewDetails={() => handleViewDetails(project)}
                            onEdit={() => handleEditProject(project)}
                            onDelete={() => handleDeleteProject(project.id)}
                        />
                    ))
                )}
            </div>

            {/* Refresh indicator */}
            {location.state?.refresh && (
                <div className="refresh-indicator">
                    Refreshing projects...
                </div>
            )}
        </div>
    );
}

export default ProjectList;