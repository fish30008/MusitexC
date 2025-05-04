// Project interfaces
export interface Project {
    id: string;
    title: string;
    owner: string;
    content: string;
    createdAt: string;
    lastModified: string;
    lastModifiedBy: string;
    archived?: boolean;
    trashed?: boolean;
}

// Project service for managing projects in localStorage
export const ProjectService = {
    // Get all projects
    getAllProjects: (): Project[] => {
        const projectsJson = localStorage.getItem('musictex_projects');
        if (!projectsJson) {
            return [];
        }
        return JSON.parse(projectsJson);
    },

    // Get a project by ID
    getProjectById: (id: string): Project | null => {
        const projects = ProjectService.getAllProjects();
        return projects.find(project => project.id === id) || null;
    },

    // Create a new project
    createProject: (title: string, content: string = '// Write your Music DSL code here\n\nplay C4 D4 E4 F4 G4 A4 B4 C5'): Project => {
        const projects = ProjectService.getAllProjects();

        const newProject: Project = {
            id: Date.now().toString(),
            title,
            owner: 'You',
            content,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            lastModifiedBy: 'You',
            archived: false,
            trashed: false
        };

        projects.push(newProject);
        localStorage.setItem('musictex_projects', JSON.stringify(projects));

        return newProject;
    },

    // Update an existing project
    updateProject: (id: string, updates: Partial<Project>): Project | null => {
        const projects = ProjectService.getAllProjects();
        const projectIndex = projects.findIndex(project => project.id === id);

        if (projectIndex === -1) {
            return null;
        }

        // Update the project
        projects[projectIndex] = {
            ...projects[projectIndex],
            ...updates,
            lastModified: new Date().toISOString(),
            lastModifiedBy: 'You'
        };

        localStorage.setItem('musictex_projects', JSON.stringify(projects));

        return projects[projectIndex];
    },

    // Delete a project
    deleteProject: (id: string): boolean => {
        const projects = ProjectService.getAllProjects();
        const filteredProjects = projects.filter(project => project.id !== id);

        if (filteredProjects.length === projects.length) {
            return false; // No project was removed
        }

        localStorage.setItem('musictex_projects', JSON.stringify(filteredProjects));
        return true;
    },

    // Format date for display
    formatDate: (dateString: string): string => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'today';
        } else if (diffDays === 1) {
            return 'yesterday';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        }
    },

    // Initialize with some example projects if empty
    initializeWithExamples: () => {
        const projects = ProjectService.getAllProjects();

        if (projects.length === 0) {
            // Add some example projects
            const defaultContent = '// Write your Music DSL code here\n\nplay C4 D4 E4 F4 G4 A4 B4 C5';

            ProjectService.createProject('Example Project', defaultContent);
            ProjectService.createProject('Scale Exercise', 'play C4 D4 E4 F4 G4 A4 B4 C5 B4 A4 G4 F4 E4 D4 C4');
            ProjectService.createProject('Rhythm Pattern', 'play C4 C4 G4 G4 A4 A4 G4');

            // Create a shared project
            const sharedProject: Project = {
                id: (Date.now() + 1).toString(),
                title: 'Shared Example',
                owner: 'Artur T.',
                content: '// This is a shared example\n\nplay E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4',
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString(),
                lastModifiedBy: 'Artur T.',
                archived: false,
                trashed: false
            };

            const allProjects = ProjectService.getAllProjects();
            allProjects.push(sharedProject);
            localStorage.setItem('musictex_projects', JSON.stringify(allProjects));
        }
    }
};

export default ProjectService;