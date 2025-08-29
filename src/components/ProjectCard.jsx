import { useState } from 'react';
import './ProjectCard.css';

function ProjectCard({ project, onViewDetails, onEdit, onDelete }) {
    const [isExpanded] = useState(false);

    // Assign status class based on project status
    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'status-completed';
            case 'in-progress': return 'status-in-progress';
            case 'not-started': return 'status-not-started';
            default: return '';
        }
    };

    // Format status text nicely
    const formatStatus = (status) => {
        return status
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const completedTasks = project.tasks?.filter(task => task.completed).length || 0;
    const totalTasks = project.tasks?.length || 0;

    return (
        <div className="project-card">
            {/* Project Title */}
            <h2 className="project-title">{project.name}</h2>

            {/* Project Description */}
            <p className="project-description">
                {project.description || 'No description'}
            </p>

            {/* Status Badge */}
            <div className="status-container">
                <span className={`status-badge ${getStatusClass(project.status)}`}>
                    {formatStatus(project.status)}
                </span>
            </div>

            {/* Progress Bar + Percentage */}
            <div className="project-progress">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${project.progress || 0}%` }}
                    ></div>
                </div>
                <span className="progress-text">{project.progress || 0}%</span>
            </div>

            {/* Meta Info */}
            <div className="project-meta">
                <span className="task-count">{completedTasks}/{totalTasks} tasks</span>
                <span className="updated-at">
                    Updated: {new Date(project.updatedAt || project.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="project-card-actions">
                <button className="btn-primary" onClick={() => onViewDetails(project)}>
                    View Details
                </button>
                <button className="btn-secondary" onClick={() => onEdit(project)}>
                    Edit
                </button>
                <button className="btn-danger" onClick={() => onDelete(project.id)}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;
