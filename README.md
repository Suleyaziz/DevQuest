# DevQuest - Project Management App

<div align="center">
  <img src='./src/assets/DevQuest-favicon.png' width="150px">
</div>

## Overview

DevQuest is a modern, responsive project management application designed specifically for developers and teams to track their coding projects and tasks. Built with React and featuring a beautiful gradient-based UI, DevQuest helps you organize, monitor, and complete your development projects efficiently.

## Features

### Core Functionality
- **Dashboard Overview**: Get a quick snapshot of your project statistics and overall progress
- **Project Management**: Create, view, edit, and delete projects with detailed information
- **Task Tracking**: Add and manage tasks within each project with completion status
- **Progress Monitoring**: Visual progress bars show completion status for each project
- **GitHub Integration**: Link your projects to GitHub repositories

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive UI**: Smooth animations and transitions for enhanced user experience
- **Real-time Updates**: Instant feedback when adding, editing, or completing tasks
- **Status Tracking**: Projects automatically update status based on task completion
- **Filtering System**: Filter projects by status (All, In Progress, Completed, Not Started)

### Dashboard Features
- Project statistics with visual cards
- Overall progress tracking
- Recent projects quick access
- Quick action buttons for common tasks

## Technology Stack

- **Frontend**: React with React Router for navigation
- **Styling**: Custom CSS with modern gradient designs
- **Icons**: Custom icon system and emoji-based visual elements
- **Data Storage**: JSON Server for mock backend (http://localhost:3000)
- **Build Tool**: Vite

---

# Project Setup & Usage Guide

## Install dependencies
```bash
npm install
```

## Set up JSON Server (for mock backend)
```bash

##Install JSON Server globally if not already installed
npm install -g json-server

# Start JSON Server (in a separate terminal)
json-server --watch db.json --port 3000
```

## Start the development server
```bash
npm run dev
```

## Open your browser
Navigate to [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

# Usage Guide

## Creating a Project
- Click on **"New Project"** in the navigation.  
- Fill in project details (name, description, status, GitHub URL).  
- Add tasks to your project.  
- Click **"Create Project"** to save.  

## Managing Tasks
- **Add Task:** Use the task form in project detail view.  
- **Complete Task:** Check the checkbox next to any task.  
- **Remove Task:** Click the × button on any task.  

## Tracking Progress
- Projects automatically calculate progress based on completed tasks.  
- Status updates automatically:  
  - *Not Started → In Progress → Completed*  
- Dashboard shows overall statistics and recent activity.  

## Navigation
- **Dashboard:** Overview of all projects and statistics.  
- **Projects:** List view of all projects with filtering options.  
- **New Project:** Form to create a new project.  

---

# API Endpoints
The application uses these RESTful endpoints:

- `GET /projects` – Fetch all projects  
- `GET /projects/:id` – Fetch a specific project  
- `POST /projects` – Create a new project  
- `PUT /projects/:id` – Update a project  
- `PATCH /projects/:id` – Partially update a project  
- `DELETE /projects/:id` – Delete a project  

---

# Customization

## Styling
The application uses a consistent color scheme with gradient backgrounds. To customize:
- Modify **CSS variables** in respective component stylesheets.  
- Update **gradient values** in container classes.  
- Adjust **color schemes** in status badges and buttons.  

## Adding New Features
- Create new components in the `components/` directory.  
- Add new pages in the `pages/` directory.  
- Update routing in `App.jsx` for new pages.  
- Extend the JSON Server schema if needed.  

---


# Contributing
1. Fork the repository.  
2. Create a feature branch:  
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. Commit your changes:  
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. Push to the branch:  
   ```bash
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request.  

---
## Authours
1. Rebecca Kibisu - coursecpd@gmail.com
2. Joseph Ondielo - josebonagain@gmail.com 
3. Kevin Koech - kevinkoesch007@gmail.com
4. Suleiman Aziz - suleimanaziz212@gmail.com

# License
This project is licensed under the **MIT License** 

