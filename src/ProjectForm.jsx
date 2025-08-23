import {useState, useEffect} from 'react';

function ProjectForm({projectTitle, projectDescription, projectStatus, onSubmit}){
    // Use different variable names to avoid conflicts with function parameters
    const [name, setName] = useState(projectTitle || '');
    const [description, setDescription] = useState(projectDescription || '');
    const [status, setStatus] = useState(projectStatus || 'not-started');
    const [githubUrl, setGithubUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Create project object
        const newProject = {
            name,
            description,
            status,
            githubUrl: githubUrl || null,
            progress: 0,
            tasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Call the onSubmit callback with the new project
        onSubmit(newProject);
        
        // Reset form fields
        setName('');
        setDescription('');
        setStatus('not-started');
        setGithubUrl('');
    };

    return (
        <div className="project-form-container">
            <h2>Add New Project</h2>
            <form onSubmit={handleSubmit} className="project-form">
                <div className="form-group">
                    <label htmlFor="projectName">Project Name</label>
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
                    <label htmlFor="githubUrl">GitHub URL (Optional)</label>
                    <input
                        type="url"
                        id="githubUrl"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username/repo"
                    />
                </div>
                
                <button type="submit" className="submit-btn">
                    Add Project
                </button>
            </form>
        </div>
    );
};

export default ProjectForm;