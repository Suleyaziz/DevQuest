import { useState, useEffect } from "react";
import "./ProjectForm.css";

function ProjectForm({
  projectTitle = "",
  projectDescription = "",
  projectStatus = "not-started",
  githubUrl: initialGithubUrl = "",
  tasks = [],
  onSubmit,
}) {
  // State
  const [name, setName] = useState(projectTitle);
  const [description, setDescription] = useState(projectDescription);
  const [status, setStatus] = useState(projectStatus);
  const [githubUrl, setGithubUrl] = useState(initialGithubUrl);
  const [projectTasks, setProjectTasks] = useState(tasks);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isEditing, setIsEditing] = useState(!!projectTitle);

  // Sync props when editing
  useEffect(() => {
    if (isEditing) {
      setName(projectTitle);
      setDescription(projectDescription);
      setStatus(projectStatus);
      setGithubUrl(initialGithubUrl);
      setProjectTasks(tasks || []);
    }
  }, [
    projectTitle,
    projectDescription,
    projectStatus,
    initialGithubUrl,
    tasks,
    isEditing,
  ]);

  // Helpers
  const calculateProjectStatus = (tasks) => {
    if (!tasks || tasks.length === 0) return "not-started";
    const completedTasks = tasks.filter((task) => task.completed).length;
    if (completedTasks === tasks.length) return "completed";
    if (completedTasks > 0) return "in-progress";
    return "not-started";
  };

  const calculateProgress = () => {
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  // Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalStatus = calculateProjectStatus(projectTasks);
    const projectData = {
      name,
      description,
      status: finalStatus,
      githubUrl: githubUrl || null,
      progress: calculateProgress(),
      tasks: projectTasks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(projectData);
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...projectTasks, newTask];
    setProjectTasks(updatedTasks);
    setStatus(calculateProjectStatus(updatedTasks));
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleRemoveTask = (taskId) => {
    const updatedTasks = projectTasks.filter((task) => task.id !== taskId);
    setProjectTasks(updatedTasks);
    setStatus(calculateProjectStatus(updatedTasks));
  };

  const handleToggleTask = (taskId) => {
    const updatedTasks = projectTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setProjectTasks(updatedTasks);
    setStatus(calculateProjectStatus(updatedTasks));
  };

  return (
    <div className="project-form-container">
      <h2>{projectTitle ? "Edit Project" : "Add New Project"}</h2>
      <form onSubmit={handleSubmit} className="project-form">
        
        {/* Project Details */}
        <div className="form-section">
          <h3>Project Details</h3>

          <div className="form-group floating">
            <input
              type="text"
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="projectName">Project Name *</label>
          </div>

          <div className="form-group floating">
            <textarea
              id="projectDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder=" "
              rows="3"
            />
            <label htmlFor="projectDescription">Description</label>
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

          <div className="form-group floating">
            <input
              type="url"
              id="githubUrlInput"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder=" "
            />
            <label htmlFor="githubUrlInput">GitHub URL (Optional)</label>
          </div>
        </div>

        {/* Tasks */}
        <div className="form-section">
          <h3>Project Tasks</h3>

          {/* Add Task */}
          <div className="add-task-form">
            <div className="form-group floating">
              <input
                type="text"
                id="newTaskTitle"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder=" "
              />
              <label htmlFor="newTaskTitle">Task Title *</label>
            </div>
            <div className="form-group floating">
              <textarea
                id="newTaskDescription"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder=" "
                rows="2"
              />
              <label htmlFor="newTaskDescription">Task Description</label>
            </div>
            <button
              type="button"
              className="add-task-btn"
              onClick={handleAddTask}
              disabled={!newTaskTitle.trim()}
            >
              + Add Task
            </button>
          </div>

          {/* Task List */}
          {projectTasks.length > 0 && (
            <div className="tasks-list">
              <h4>
                Current Tasks ({projectTasks.length}) – Progress:{" "}
                {calculateProgress()}%
              </h4>
              {projectTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="task-header">
                    <label className="task-checkbox">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleTask(task.id)}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <span
                      className={`task-title ${
                        task.completed ? "completed" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <button
                    type="button"
                    className="remove-task-btn"
                    onClick={() => handleRemoveTask(task.id)}
                    title="Remove task"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="submit-btn">
          {projectTitle ? "Update Project" : "Create Project"}
        </button>
      </form>
    </div>
  );
}

export default ProjectForm;
