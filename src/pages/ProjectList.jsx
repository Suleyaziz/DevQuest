import { useState, useEffect } from 'react';
import ProjectForm from '../ProjectForm';
import './ProjectList.css'; // Import the CSS file for styling

function ProjectList() {
    // State to store the list of projects
    const [projects, setProjects] = useState([]);
    // State to track loading status
    const [loading, setLoading] = useState(true);
    // State to store any error that occurs during fetching
    const [error, setError] = useState(null);
    // State to track the current filter (all, completed, in-progress, not-started)
    const [filter, setFilter] = useState('all');

    // useEffect hook to fetch projects when the component mounts
    useEffect(() => {
        // Define an async function to fetch projects from the API
        fetch("http://localhost:3000/projects")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then(data => {
            setProjects(data);
            setError(null);
        }).catch(err => {
            setError(err.message);
            console.error("Failed to fetch projects:", err);
        }).finally(() => {
            setLoading(false);
        });

        // Call the fetchProjects function
      //  fetchProjects();
    }, []); // Empty dependency array means this effect runs only once on mount

    // Filter projects based on the current filter status
    const filteredProjects = projects.filter(project => {
        if (filter === 'all') return true; // Return all projects if filter is 'all'
        return project.status === filter; // Return only projects that match the filter
    });

    // Helper function to get the CSS class for status badges
    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'status-completed'; // Green background for completed
            case 'in-progress': return 'status-in-progress'; // Yellow background for in-progress
            case 'not-started': return 'status-not-started'; // Gray background for not-started
            default: return ''; // Default empty class
        }
    };

    // Helper function to format status text (e.g., 'in-progress' -> 'In Progress')
    const formatStatus = (status) => {
        return status.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1) // Capitalize each word
        ).join(' '); // Join words with spaces
    };

    // Display loading state while data is being fetched
    if (loading) {
        return (
            <div className="project-list-loading">
                <div className="spinner"></div> {/* Loading spinner animation */}
                <p>Loading projects...</p> {/* Loading text */}
            </div>
        );
    }

    // Display error state if fetching projects failed
    if (error) {
        return (
            <div className="project-list-error">
                <h2>Error Loading Projects</h2> {/* Error heading */}
                <p>{error}</p> {/* Display the error message */}
                <button onClick={() => window.location.reload()}>Try Again</button> {/* Retry button */}
            </div>
        );

    }
    function handleProjectSubmit(newProject) {
        // Update the projects state with the new project
        fetch('http://localhost:3000/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProject)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setProjects(prevProjects => [...prevProjects, data]);
        })
        .catch(err => {
            setError(err.message);
            console.error("Failed to add project:", err);
        });
    }

    // Main component render when data is successfully loaded
    return (
        <div className="project-list-container">
            <h1>My Projects</h1> {/* Page heading */}
            
            {/* Filter buttons section */}
            <div className="project-filters">
                {/* Button to show all projects */}
                <button 
                    className={filter === 'all' ? 'active' : ''} // Add active class if selected
                    onClick={() => setFilter('all')} // Set filter to 'all' on click
                >
                    All Projects
                </button>
                {/* Button to show in-progress projects */}
                <button 
                    className={filter === 'in-progress' ? 'active' : ''}
                    onClick={() => setFilter('in-progress')}
                >
                    In Progress
                </button>
                {/* Button to show completed projects */}
                <button 
                    className={filter === 'completed' ? 'active' : ''}
                    onClick={() => setFilter('completed')}
                >
                    Completed
                </button>
                {/* Button to show not-started projects */}
                <button 
                    className={filter === 'not-started' ? 'active' : ''}
                    onClick={() => setFilter('not-started')}
                >
                    Not Started
                </button>
            </div>

            {/* Projects grid container */}
            <div className="projects-grid">
                {/* Display message if no projects match the filter */}
                {filteredProjects.length === 0 ? (
                    <div className="no-projects">
                        <p>No projects found{filter !== 'all' ? ` with status "${filter}"` : ''}.</p>
                    </div>
                ) : (
                    /* Map through filtered projects and render project cards */
                    filteredProjects.map(project => (
                        <div key={project.id} className="project-card"> {/* Unique key for each project */}
                            <div className="project-card-header">
                                <h3>{project.name}</h3> {/* Project name */}
                                {/* Status badge with dynamic class and formatted text */}
                                <span className={`status-badge ${getStatusClass(project.status)}`}>
                                    {formatStatus(project.status)}
                                </span>
                            </div>
                            
                            <p className="project-description">{project.description}</p> {/* Project description */}
                            
                            {/* Progress bar section */}
                            <div className="project-progress">
                                <div className="progress-bar">
                                    {/* Progress fill with width based on completion percentage */}
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${project.progress}%` }}
                                    ></div>
                                </div>
                                {/* Text showing completion percentage */}
                                <span className="progress-text">{project.progress}% Complete</span>
                            </div>
                            
                            {/* Project metadata section */}
                            <div className="project-meta">
                                {/* Task completion count */}
                                <span className="task-count">
                                    {project.tasks.filter(task => task.completed).length}/
                                    {project.tasks.length} tasks completed
                                </span>
                                {/* Last updated date */}
                                <span className="updated-at">
                                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                                </span>
                            </div>
                            
                            {/* GitHub link (only shown if project has a GitHub URL) */}
                            {project.githubUrl && (
                                <a 
                                    href={project.githubUrl} 
                                    target="_blank"  // Open in new tab
                                    rel="noopener noreferrer" // Security best practice
                                    className="github-link"
                                >
                                    <i className="fab fa-github"></i> View on GitHub
                                </a>
                            )}
                            
                            {/* Button to view project details */}
                            <button className="view-project-btn">
                                View Project Details
                            </button>
                        </div>
                    ))
                )}
            </div>
            <ProjectForm onSubmit={handleProjectSubmit} />
        </div>
    );
}

export default ProjectList; // Export the component for use in other files