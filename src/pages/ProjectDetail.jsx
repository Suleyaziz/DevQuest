import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectDetail.css';

function ProjectDetail() {
    const { id } = useParams(); // Get project ID from URL parameters
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [project, setProject] = useState(null); // State for project data
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for error handling
    const [newTaskTitle, setNewTaskTitle] = useState(''); // State for new task title input
    const [newTaskDescription, setNewTaskDescription] = useState(''); // State for new task description input

    // Fetch project data when component mounts or ID changes
    useEffect(() => {
        fetch(`http://localhost:3000/projects/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setProject(data); // Set project data in state
                setError(null); // Clear any previous errors
            })
            .catch(err => {
                setError(err.message); // Set error message
                console.error("Failed to fetch project:", err);
            })
            .finally(() => {
                setLoading(false); // Mark loading as complete
            });
    }, [id]);

    // Helper function to calculate project status based on tasks
    const calculateProjectStatus = (tasks) => {
        if (!tasks || tasks.length === 0) return 'not-started'; // No tasks = not started
        
        const completedTasks = tasks.filter(task => task.completed).length; // Count completed tasks
        const totalTasks = tasks.length; // Total number of tasks
        
        if (completedTasks === totalTasks) {
            return 'completed'; // All tasks completed
        } else if (completedTasks > 0) {
            return 'in-progress'; // Some tasks completed
        } else {
            return 'not-started'; // No tasks completed
        }
    };

    // Function to handle adding a new task
    const handleAddTask = (e) => {
        e.preventDefault(); // Prevent form submission default behavior
        if (!newTaskTitle.trim()) return; // Validate task title is not empty

        // Create new task object
        const newTask = {
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
            id: Date.now() // Temporary ID
        };

        // Create updated tasks array with new task
        const updatedTasks = [...project.tasks, newTask];
        // Calculate new status based on updated tasks
        const newStatus = calculateProjectStatus(updatedTasks);

        // Optimistic UI update - update state immediately for better UX
        setProject(prevProject => ({
            ...prevProject,
            tasks: updatedTasks,
            status: newStatus // Update project status
        }));

        // Send update to server
        fetch(`http://localhost:3000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tasks: updatedTasks,
                status: newStatus, // Include updated status
                updatedAt: new Date().toISOString() // Update timestamp
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add task');
            }
            return response.json();
        })
        .then(updatedProject => {
            setProject(updatedProject); // Update with server response
        })
        .catch(err => {
            setError(err.message);
            console.error("Failed to add task:", err);
            // Revert optimistic update if server request fails
            setProject(prevProject => ({
                ...prevProject,
                tasks: prevProject.tasks,
                status: prevProject.status
            }));
        });

        // Clear input fields
        setNewTaskTitle('');
        setNewTaskDescription('');
    };

    // Function to handle toggling task completion status
    const handleToggleTask = (taskId) => {
        // Update tasks array with toggled completion status
        const updatedTasks = project.tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        // Calculate new status based on updated tasks
        const newStatus = calculateProjectStatus(updatedTasks);

        // Optimistic UI update
        setProject(prevProject => ({
            ...prevProject,
            tasks: updatedTasks,
            status: newStatus // Update project status
        }));

        // Send update to server
        fetch(`http://localhost:3000/projects/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                tasks: updatedTasks,
                status: newStatus, // Include updated status
                updatedAt: new Date().toISOString()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        })
        .then(updatedProject => {
            setProject(updatedProject); // Update with server response
        })
        .catch(err => {
            setError(err.message);
            console.error("Failed to update task:", err);
            // Revert optimistic update
            setProject(prevProject => ({
                ...prevProject,
                tasks: prevProject.tasks,
                status: prevProject.status
            }));
        });
    };

    // Function to handle project deletion
    const handleDeleteProject = () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            fetch(`http://localhost:3000/projects/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete project');
                }
                navigate('/projects'); // Navigate back to projects list
            })
            .catch(err => {
                setError(err.message);
                console.error("Failed to delete project:", err);
            });
        }
    };

    // Function to calculate progress percentage
    const calculateProgress = () => {
        if (!project?.tasks.length) return 0; // Return 0 if no tasks
        const completedTasks = project.tasks.filter(task => task.completed).length;
        return Math.round((completedTasks / project.tasks.length) * 100); // Calculate percentage
    };

    // Loading state UI
    if (loading) {
        return (
            <div className="project-detail-loading">
                <div className="spinner"></div>
                <p>Loading project details...</p>
            </div>
        );
    }

    // Error state UI
    if (error) {
        return (
            <div className="project-detail-error">
                <h2>Error Loading Project</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/projects')}>Back to Projects</button>
            </div>
        );
    }

    // Project not found state UI
    if (!project) {
        return (
            <div className="project-detail-not-found">
                <h2>Project Not Found</h2>
                <p>The project you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/projects')}>Back to Projects</button>
            </div>
        );
    }

    const progress = calculateProgress(); // Calculate current progress

    return (
        <div className="project-detail-container">
            {/* Header section with back button and action buttons */}
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
                {/* Project information section */}
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

                    {/* Progress bar section */}
                    <div className="progress-section">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Tasks management section */}
                <div className="tasks-section">
                    <h2>Tasks</h2>
                    
                    {/* Form to add new tasks */}
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

                    {/* Tasks list */}
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