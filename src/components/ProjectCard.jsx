import { useState } from 'react';
import './ProjectCard.css';

function ProjectCard({ project, onViewDetails, onEdit, onDelete }) {
    // Local state to handle "expanded/collapsed" card view (not fully implemented yet)
    const [isExpanded, setIsExpanded] = useState(false);
    
    /**
     * Returns a CSS class for the status badge depending on the project's status.
     * Helps style completed, in-progress, or not-started projects differently.
     */
    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'in-progress': return 'status-in-progress';
            case 'not-started': return 'status-not-started';
            default: return '';
        }
    };

    /**
     * Formats status strings by capitalizing and spacing words.
     * Example: "in-progress" → "In Progress"
     */
    const formatStatus = (status) => {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    /**
     * Calculate how many tasks are completed and total tasks.
     * Uses optional chaining (?.) to avoid crashes if tasks are undefined.
     */
    const completedTasks = project.tasks?.filter(task => task.completed).length || 0;
    const totalTasks = project.tasks?.length || 0;

    return (
        <div className="project-card">
            {/* ========== Card Header: Title + Status Badge ========== */}
            <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className={`status-badge ${getStatusClass(project.status)}`}>
                    {formatStatus(project.status)}
                </span>
            </div>
            
            {/* ========== Project Description ========== */}
            <p className="project-description">
                {project.description || 'No description provided'}
            </p>
            
            {/* ========== Progress Bar ========== */}
            <div className="project-progress">
                <div className="progress-bar">
                    {/* Fills the bar based on project.progress (defaults to 0) */}
                    <div 
                        className="progress-fill" 
                        style={{ width: `${project.progress || 0}%` }}
                    ></div>
                </div>
                <span className="progress-text">
                    {project.progress || 0}% Complete
                </span>
            </div>
            
            {/* ========== Project Metadata (Tasks + Last Updated Date) ========== */}
            <div className="project-meta">
                <span className="task-count">
                    {completedTasks}/{totalTasks} tasks
                </span>
                <span className="updated-at">
                    Updated: {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* ========== Action Buttons ========== */}
            <div className="project-card-actions">
                <button 
                    className="btn-primary" 
                    onClick={() => onViewDetails(project)}
                >
                    View Details
                </button>
                <button 
                    className="btn-secondary" 
                    onClick={() => onEdit(project)}
                >
                    Edit
                </button>
                <button 
                    className="btn-danger" 
                    onClick={() => onDelete(project.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;
