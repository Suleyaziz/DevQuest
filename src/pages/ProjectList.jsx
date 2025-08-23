import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import './ProjectList.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = () => {
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
                    setProjects(prev => prev.filter(p => p.id !== projectId));
                } else {
                    throw new Error('Failed to delete project');
                }
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to delete project:", err);
            });
        }
    };

    const filteredProjects = projects.filter(project => {
        if (filter === 'all') return true;
        return project.status === filter;
    });

    function handleViewDetails(project) {
        navigate(`/projects/${project.id}`);
    }

    function handleEditProject(project) {
        navigate(`/projects/${project.id}/edit`);
    }

    if (loading) {
        return <div className="loading">Loading projects...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <h2>Error Loading Projects</h2>
                <p>{error}</p>
                <button onClick={fetchProjects}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="project-list-container">
            <div className="project-list-header">
                <h1>My Projects</h1>
                <button 
                    className="create-project-btn"
                    onClick={() => navigate('/new-project')}
                >
                    + New Project
                </button>
            </div>
            
            <div className="project-filters">
                <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                    All Projects
                </button>
                <button className={filter === 'in-progress' ? 'active' : ''} onClick={() => setFilter('in-progress')}>
                    In Progress
                </button>
                <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>
                    Completed
                </button>
                <button className={filter === 'not-started' ? 'active' : ''} onClick={() => setFilter('not-started')}>
                    Not Started
                </button>
            </div>

            <div className="projects-grid">
                {filteredProjects.length === 0 ? (
                    <div className="no-projects">
                        <p>No projects found{filter !== 'all' ? ` with status "${filter}"` : ''}.</p>
                    </div>
                ) : (
                    filteredProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onViewDetails={handleViewDetails}
                            onEdit={handleEditProject}
                            onDelete={handleDeleteProject}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ProjectList;