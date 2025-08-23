import { useState, useEffect } from 'react';
import './ProjectForm.css';

function ProjectForm({ project, onSubmit }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('not-started');
    const [githubUrl, setGithubUrl] = useState('');

    useEffect(() => {
        if (project) {
            setName(project.name || '');
            setDescription(project.description || '');
            setStatus(project.status || 'not-started');
            setGithubUrl(project.githubUrl || '');
        }
    }, [project]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const projectData = {
            name,
            description,
            status,
            githubUrl,
            tasks: project?.tasks || [],
            createdAt: project?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        onSubmit(projectData);
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <div className="form-group">
                <label>Project Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter project name"
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your project"
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label>Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div className="form-group">
                <label>GitHub URL (Optional)</label>
                <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/repo"
                />
            </div>

            <button type="submit" className="submit-btn">
                {project ? 'Update Project' : 'Create Project'}
            </button>
        </form>
    );
}

export default ProjectForm;