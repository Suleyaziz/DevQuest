import { useState, useEffect } from 'react';
import './ProjectForm.css';

function ProjectForm({ 
  projectTitle = '', 
  projectDescription = '', 
  projectStatus = 'not-started', 
  githubUrl: initialGithubUrl = '',
  tasks = [],
  onSubmit 
}) {
    // State management for form fields
    const [name, setName] = useState(projectTitle);
    const [description, setDescription] = useState(projectDescription);
    const [status, setStatus] = useState(projectStatus);
    const [githubUrl, setGithubUrl] = useState(initialGithubUrl);
    const [projectTasks, setProjectTasks] = useState(tasks);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [isEditing, setIsEditing] = useState(!!projectTitle);

    // Update form fields when props change (for edit mode)
    useEffect(() => {
        if (isEditing) {
            setName(projectTitle);
            setDescription(projectDescription);
            setStatus(projectStatus);
            setGithubUrl(initialGithubUrl);
            setProjectTasks(tasks || []);
        }
    }, [projectTitle, projectDescription, projectStatus, initialGithubUrl, tasks, isEditing]);

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

    // Form submission handler
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        
        // Calculate final status based on current tasks
        const finalStatus = calculateProjectStatus(projectTasks);
        
        // Prepare project data for submission
        const projectData = {
            name,
            description,
            status: finalStatus, // Use calculated status
            githubUrl: githubUrl || null,
            progress: calculateProgress(),
            tasks: projectTasks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        onSubmit(projectData); // Call parent onSubmit callback
    };

    // Calculate progress percentage
    const calculateProgress = () => {
        if (projectTasks.length === 0) return 0; // Return 0 if no tasks
        const completedTasks = projectTasks.filter(task => task.completed).length;
        return Math.round((completedTasks / projectTasks.length) * 100); // Calculate percentage
    };

    // Handler for adding new tasks
    const handleAddTask = (e) => {
        e.preventDefault(); // Prevent default form behavior
        if (!newTaskTitle.trim()) return; // Validate task title is not empty

        // Create new task object
        const newTask = {
            id: Date.now(), // Generate unique ID
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Create updated tasks array
        const updatedTasks = [...projectTasks, newTask];
        // Calculate new status based on updated tasks
        const newStatus = calculateProjectStatus(updatedTasks);

        // Update state
        setProjectTasks(updatedTasks);
        setStatus(newStatus); // Update project status
        setNewTaskTitle(''); // Clear input field
        setNewTaskDescription(''); // Clear input field
    };

    // Handler for removing tasks
    const handleRemoveTask = (taskId) => {
        // Filter out the task to be removed
        const updatedTasks = projectTasks.filter(task => task.id !== taskId);
        // Calculate new status based on remaining tasks
        const newStatus = calculateProjectStatus(updatedTasks);

        // Update state
        setProjectTasks(updatedTasks);
        setStatus(newStatus); // Update project status
    };

    // Handler for toggling task completion
    const handleToggleTask = (taskId) => {
        // Toggle task completion status
        const updatedTasks = projectTasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        // Calculate new status based on updated tasks
        const newStatus = calculateProjectStatus(updatedTasks);

        // Update state
        setProjectTasks(updatedTasks);
        setStatus(newStatus); // Update project status
    };

    return (
        <div className="project-form-container">
            <h2>{projectTitle ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} className="project-form">
                {/* Project Details Section */}
                <div className="form-section">
                    <h3>Project Details</h3>
                    
                    <div className="form-group">
                        <label htmlFor="projectName">Project Name *</label>
                        <input
                            type="text"
                            id="projectName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter project name"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="projectDescription">Description</label>
                        <textarea
                            id="projectDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your project"
                            rows="3"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="projectStatus">Status</label>
                        <select
                            id="projectStatus"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="not-started">Not Started</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="githubUrlInput">GitHub URL (Optional)</label>
                        <input
                            type="url"
                            id="githubUrlInput"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/username/repo"
                        />
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="form-section">
                    <h3>Project Tasks</h3>
                    
                    {/* Add Task Form */}
                    <div className="add-task-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="newTaskTitle">Task Title *</label>
                                <input
                                    type="text"
                                    id="newTaskTitle"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="Enter task title"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="newTaskDescription">Task Description (Optional)</label>
                            <textarea
                                id="newTaskDescription"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
                                placeholder="Describe the task"
                                rows="2"
                            />
                            <button 
                                type="button" 
                                className="add-task-btn"
                                onClick={handleAddTask}
                                disabled={!newTaskTitle.trim()}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>

                    {/* Tasks List */}
                    {projectTasks.length > 0 && (
                        <div className="tasks-list">
                            <h4>Current Tasks ({projectTasks.length})</h4>
                            {projectTasks.map((task) => (
                                <div key={task.id} className="task-item">
                                    <div className="task-content">
                                        <div className="task-header">
                                            <label className="task-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleTask(task.id)}
                                                />
                                                <span className="checkmark"></span>
                                            </label>
                                            <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                                                {task.title}
                                            </span>
                                            <button
                                                type="button"
                                                className="remove-task-btn"
                                                onClick={() => handleRemoveTask(task.id)}
                                                title="Remove task"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        {task.description && (
                                            <p className="task-description">{task.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">
                    {projectTitle ? 'Update Project' : 'Create Project'}
                </button>
            </form>
        </div>
    );
}

export default ProjectForm;