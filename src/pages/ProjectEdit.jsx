// ProjectEdit.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';
import './ProjectEdit.css';

function ProjectEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProject();
    }, [id]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`http://localhost:3000/projects/${id}`);
            if (!response.ok) throw new Error('Failed to fetch project');
            const data = await response.json();
            setProject(data);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching project:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (updatedProject) => {
        try {
            const response = await fetch(`http://localhost:3000/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...updatedProject,
                    id: parseInt(id), // Ensure ID is preserved
                    updatedAt: new Date().toISOString()
                }),
            });

            if (!response.ok) throw new Error('Failed to update project');

            // Navigate back to projects list with refresh flag
            navigate('/projects', { state: { refresh: true } });
        } catch (err) {
            setError(err.message);
            console.error('Error updating project:', err);
            alert('Failed to update project. Please try again.');
        }
    };

    const handleBack = () => {
        navigate('/projects');
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading">Loading project...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="error">
                    <h2>Error Loading Project</h2>
                    <p>{error}</p>
                    <button onClick={handleBack} >Back to Projects</button>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="page-container">
                <div className="error">
                    <h2>Project Not Found</h2>
                    <p>The project you're trying to edit doesn't exist.</p>
                    <button onClick={handleBack}>Back to Projects</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="edit-project-header">
                <button onClick={handleBack} className="back-button">← Back to Projects</button>
                <h1>Edit Project</h1>
            </div>
            <ProjectForm
                projectTitle={project.name}
                projectDescription={project.description}
                projectStatus={project.status}
                githubUrl={project.githubUrl}
                tasks={project.tasks || []}
                onSubmit={handleSubmit}
            />
        </div>
    );
}

export default ProjectEdit;