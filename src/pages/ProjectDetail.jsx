import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetail.css';

function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/projects/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProject(data);
                setError(null);
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to fetch project:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const newTask = {
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            id: Date.now() // Temporary ID until we get one from the server
        };

        // Optimistic UI update
        setProject(prevProject => ({
            ...prevProject,
            tasks: [...prevProject.tasks, newTask]
        }));

        // Send to server
        fetch(`http://localhost:3000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tasks: [...project.tasks, newTask]
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            return response.json();
        })
        .then(updatedProject => {
            setProject(updatedProject);
        })
        .catch(err => {
            setError(err.message);
            console.error("Failed to add task:", err);
            // Revert optimistic update
            setProject(prevProject => ({
                ...prevProject,
                tasks: prevProject.tasks.filter(task => task.id !== newTask.id)
            }));
        });

        setNewTaskTitle('');
        setNewTaskDescription('');
    };

    const handleToggleTask = (taskId) => {
        const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        // Optimistic UI update
        setProject(prevProject => ({
            ...prevProject,
            tasks: updatedTasks
        }));

        // Send to server
        fetch(`http://localhost:3000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tasks: updatedTasks })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        })
        .then(updatedProject => {
            setProject(updatedProject);
        })
        .catch(err => {
            setError(err.message);
            console.error("Failed to update task:", err);
            // Revert optimistic update
            setProject(prevProject => ({
                ...prevProject,
                tasks: prevProject.tasks
            }));
        });
    };

    const handleDeleteProject = () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            fetch(`http://localhost:3000/projects/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }
                navigate('/projects');
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to delete project:", err);
            });
        }
    };

    const calculateProgress = () => {
        if (!project?.tasks.length) return 0;
        const completedTasks = project.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / project.tasks.length) * 100);
    };

    if (loading) {
        return (
            <div className="project-detail-loading">
                <div className="spinner"></div>
                <p>Loading project details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-detail-error">
                <h2>Error Loading Project</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/projects')}>Back to Projects</button>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="project-detail-not-found">
                <h2>Project Not Found</h2>
                <p>The project you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/projects')}>Back to Projects</button>
            </div>
        );
    }

    const progress = calculateProgress();

    return (
        <div className="project-detail-container">
            <div className="project-detail-header">
                <button 
                    className="back-button"
                    onClick={() => navigate('/projects')}
                >
                    ← Back to Projects
                </button>
                
                <div className="project-header-actions">
                    <button 
                        className="edit-button"
                        onClick={() => navigate(`/projects/${id}/edit`)}
                    >
                        Edit Project
                    </button>
                    <button 
                        className="delete-button"
                        onClick={handleDeleteProject}
                    >
                        Delete Project
                    </button>
                </div>
            </div>

            <div className="project-detail-content">
                <div className="project-info">
                    <h1>{project.name}</h1>
                    
                    <div className="project-meta">
                        <span className={`status-badge status-${project.status}`}>
                            {project.status.split('-').map(word => 
                                word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                        </span>
                        <span className="progress-text">{progress}% Complete</span>
                        <span className="task-count">
                            {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks
                        </span>
                        <span className="created-date">
                            Created: {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    {project.description && (
                        <p className="project-description">{project.description}</p>
                    )}

                    {project.githubUrl && (
                        <a 
                            href={project.githubUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="github-link"
                        >
                            <i className="fab fa-github"></i> View on GitHub
                        </a>
                    )}

                    <div className="progress-section">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="tasks-section">
                    <h2>Tasks</h2>
                    
                    <form onSubmit={handleAddTask} className="add-task-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Add a new task..."
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Task description (optional)"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                rows="2"
                            />
                        </div>
                        <button type="submit" className="add-task-button">
                            Add Task
                        </button>
                    </form>

                    <div className="tasks-list">
                        {project.tasks.length === 0 ? (
                            <p className="no-tasks">No tasks yet. Add your first task above!</p>
                        ) : (
                            project.tasks.map(task => (
                                <div key={task.id} className="task-item">
                                    <label className="task-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => handleToggleTask(task.id)}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <div className="task-content">
                                        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                                            {task.title}
                                        </span>
                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}
                                        <span className="task-date">
                                            Added: {new Date(task.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectDetail;