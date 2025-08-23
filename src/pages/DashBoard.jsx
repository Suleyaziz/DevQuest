import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashBoard.css';

function DashBoard() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        notStarted: 0,
        totalTasks: 0,
        completedTasks: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3000/projects")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const projectsWithProgress = data.map(project => ({
                    ...project,
                    progress: calculateProjectProgress(project)
                }));
                setProjects(projectsWithProgress);
                calculateStats(projectsWithProgress);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to fetch projects:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const calculateProjectProgress = (project) => {
        if (!project.tasks || project.tasks.length === 0) return 0;
        const completedTasks = project.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / project.tasks.length) * 100);
    };

    const calculateStats = (projectsData) => {
        const total = projectsData.length;
        const completed = projectsData.filter(p => p.status === 'completed').length;
        const inProgress = projectsData.filter(p => p.status === 'in-progress').length;
        const notStarted = projectsData.filter(p => p.status === 'not-started').length;
        
        const totalTasks = projectsData.reduce((sum, project) => sum + (project.tasks?.length || 0), 0);
        const completedTasks = projectsData.reduce((sum, project) => 
            sum + (project.tasks?.filter(task => task.completed).length || 0), 0
        );

        setStats({
            total,
            completed,
            inProgress,
            notStarted,
            totalTasks,
            completedTasks
        });
    };

    const getProgressPercentage = () => {
        if (stats.totalTasks === 0) return 0;
        return Math.round((stats.completedTasks / stats.totalTasks) * 100);
    };

    const getRecentProjects = () => {
        return projects
            .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
            .slice(0, 5);
    };

    const handleViewProject = (projectId) => {
        navigate(`/projects/${projectId}`);
    };

    const handleViewAllProjects = () => {
        navigate('/projects');
    };

    const handleCreateProject = () => {
        navigate('/new-project');
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-error">
                <h2>Error Loading Dashboard</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
        );
    }

    const progressPercentage = getProgressPercentage();
    const recentProjects = getRecentProjects();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Track your coding quests. Conquer your goals.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card total-projects">
                    <div className="stat-icon">📂</div>
                    <div className="stat-content">
                        <h3>{stats.total}</h3>
                        <p>Total Projects</p>
                    </div>
                </div>

                <div className="stat-card completed-projects">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <h3>{stats.completed}</h3>
                        <p>Completed</p>
                    </div>
                </div>

                <div className="stat-card progress-projects">
                    <div className="stat-icon">🚀</div>
                    <div className="stat-content">
                        <h3>{stats.inProgress}</h3>
                        <p>In Progress</p>
                    </div>
                </div>

                <div className="stat-card tasks-stats">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <h3>{stats.completedTasks}/{stats.totalTasks}</h3>
                        <p>Tasks Completed</p>
                    </div>
                </div>
            </div>

            <div className="progress-section">
                <div className="progress-header">
                    <h2>Overall Progress</h2>
                    <span className="progress-percentage">{progressPercentage}%</span>
                </div>
                <div className="progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <div className="progress-labels">
                    <span>Not Started</span>
                    <span>In Progress</span>
                    <span>Completed</span>
                </div>
            </div>

            <div className="recent-projects">
                <div className="section-header">
                    <h2>Recent Projects</h2>
                    <button 
                        className="view-all-btn"
                        onClick={handleViewAllProjects}
                    >
                        View All →
                    </button>
                </div>

                {recentProjects.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📁</div>
                        <h3>No projects yet</h3>
                        <p>Start your coding journey by creating your first project</p>
                        <button 
                            className="create-project-btn"
                            onClick={handleCreateProject}
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {recentProjects.map(project => (
                            <div key={project.id} className="project-card">
                                <div className="project-card-header">
                                    <h3>{project.name}</h3>
                                    <span className={`status-badge status-${project.status}`}>
                                        {project.status.split('-').map(word => 
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </span>
                                </div>
                                
                                <p className="project-description">
                                    {project.description || 'No description provided'}
                                </p>

                                <div className="project-progress">
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill" 
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{project.progress}% Complete</span>
                                </div>

                                <div className="project-meta">
                                    <span className="task-count">
                                        {(project.tasks?.filter(t => t.completed).length || 0)}/{(project.tasks?.length || 0)} tasks
                                    </span>
                                    <span className="updated-date">
                                        Updated: {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <button 
                                    className="view-project-btn"
                                    onClick={() => handleViewProject(project.id)}
                                >
                                    View Project
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button 
                        className="action-btn primary"
                        onClick={handleCreateProject}
                    >
                        <span className="action-icon">➕</span>
                        New Project
                    </button>
                    <button 
                        className="action-btn secondary"
                        onClick={handleViewAllProjects}
                    >
                        <span className="action-icon">📋</span>
                        View All Projects
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;