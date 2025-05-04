import React, { useState, useEffect } from 'react';
import { Download, Copy, Trash, Archive, MoreHorizontal, Plus, RefreshCw, LogOut } from 'lucide-react';
import ProjectService, { Project } from './services/ProjectService';
import AccountDropdown from './AccountDropdown';

interface ProjectsDashboardProps {
    onNavigateToEditor: (projectId?: string) => void;
    onLogout: () => void;
}

type ProjectCategory = 'all' | 'yours' | 'shared' | 'archived' | 'trashed';

const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({ onNavigateToEditor, onLogout }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentCategory, setCurrentCategory] = useState<ProjectCategory>('all');

    // Load projects on component mount
    useEffect(() => {
        // Initialize with examples if empty
        ProjectService.initializeWithExamples();

        // Load all projects
        loadProjects();
    }, []);

    // Function to load projects
    const loadProjects = () => {
        const loadedProjects = ProjectService.getAllProjects();
        setProjects(loadedProjects);
    };

    // Filter projects based on search query and category
    const getFilteredProjects = () => {
        let filtered = projects;

        // Apply category filter
        switch (currentCategory) {
            case 'yours':
                // Your projects excluding archived and trashed
                filtered = filtered.filter(project =>
                    project.owner === 'You' &&
                    !project.archived &&
                    !project.trashed
                );
                break;
            case 'shared':
                // Shared projects excluding archived and trashed
                filtered = filtered.filter(project =>
                    project.owner !== 'You' &&
                    !project.archived &&
                    !project.trashed
                );
                break;
            case 'archived':
                // Only archived projects (not in trash)
                filtered = filtered.filter(project =>
                    project.archived &&
                    !project.trashed
                );
                break;
            case 'trashed':
                // Only trashed projects
                filtered = filtered.filter(project =>
                    project.trashed
                );
                break;
            default: // 'all'
                // All active projects (not archived, not trashed)
                filtered = filtered.filter(project =>
                    !project.archived &&
                    !project.trashed
                );
        }

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return filtered;
    };

    const filteredProjects = getFilteredProjects();

    // Get the title for the current category
    const getCategoryTitle = () => {
        switch (currentCategory) {
            case 'yours': return 'Your Projects';
            case 'shared': return 'Shared with You';
            case 'archived': return 'Archived Projects';
            case 'trashed': return 'Trashed Projects';
            default: return 'All Projects';
        }
    };

    // Account dropdown handlers
    const handleSettings = () => {
        alert('Account settings would be implemented here');
        // In a real app, you would navigate to the settings page
    };

    // Toggle project selection
    const toggleProjectSelection = (projectId: string) => {
        if (selectedProjects.includes(projectId)) {
            setSelectedProjects(selectedProjects.filter(id => id !== projectId));
        } else {
            setSelectedProjects([...selectedProjects, projectId]);
        }
    };

    // Toggle selection of all projects
    const toggleSelectAll = () => {
        if (selectedProjects.length === filteredProjects.length) {
            setSelectedProjects([]);
        } else {
            setSelectedProjects(filteredProjects.map(project => project.id));
        }
    };

    // Create a new project and navigate to the editor
    const handleNewProject = () => {
        const newProject = ProjectService.createProject('Untitled Project');
        // Refresh projects list
        loadProjects();
        // Navigate to editor with the new project
        onNavigateToEditor(newProject.id);
    };

    // Handle opening a project
    const handleOpenProject = (projectId: string) => {
        onNavigateToEditor(projectId);
    };

    // Handle project deletion
    const handleDeleteProject = (projectId: string) => {
        if (currentCategory === 'trashed') {
            // Permanently delete from trash
            if (window.confirm('Are you sure you want to permanently delete this project?')) {
                ProjectService.deleteProject(projectId);
                loadProjects();
                if (selectedProjects.includes(projectId)) {
                    setSelectedProjects(selectedProjects.filter(id => id !== projectId));
                }
            }
        } else {
            // Move to trash
            if (window.confirm('Move this project to trash?')) {
                ProjectService.updateProject(projectId, {
                    trashed: true,
                    archived: false // Ensure it's not archived and trashed at the same time
                });
                loadProjects();
                if (selectedProjects.includes(projectId)) {
                    setSelectedProjects(selectedProjects.filter(id => id !== projectId));
                }
            }
        }
    };

    // Handle project archiving
    const handleArchiveProject = (projectId: string) => {
        ProjectService.updateProject(projectId, {
            archived: true,
            trashed: false // Ensure it's not archived and trashed at the same time
        });
        loadProjects();
        if (selectedProjects.includes(projectId)) {
            setSelectedProjects(selectedProjects.filter(id => id !== projectId));
        }
    };

    // Handle restoring from trash or archive
    const handleRestoreProject = (projectId: string) => {
        if (currentCategory === 'trashed') {
            ProjectService.updateProject(projectId, { trashed: false });
        } else if (currentCategory === 'archived') {
            ProjectService.updateProject(projectId, { archived: false });
        }
        loadProjects();
        if (selectedProjects.includes(projectId)) {
            setSelectedProjects(selectedProjects.filter(id => id !== projectId));
        }
    };

    // Handle project duplication
    const handleDuplicateProject = (projectId: string) => {
        const project = ProjectService.getProjectById(projectId);
        if (project) {
            ProjectService.createProject(`${project.title} (Copy)`, project.content);
            // Refresh projects list
            loadProjects();
        }
    };

    // Change category
    const handleCategoryChange = (category: ProjectCategory) => {
        setCurrentCategory(category);
        setSelectedProjects([]);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <div>
                            <h1 className="text-lg font-bold text-green-600">MusicTex</h1>
                            <p className="text-xs text-gray-500">A Digital Music Solution</p>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <button
                        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center"
                        onClick={handleNewProject}
                    >
                        <Plus size={16} className="mr-1" />
                        <span>New Project</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-2">
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer ${currentCategory === 'all'
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            <span className="block">All Projects</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer ${currentCategory === 'yours'
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('yours')}
                        >
                            <span className="block">Your Projects</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer ${currentCategory === 'shared'
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('shared')}
                        >
                            <span className="block">Shared with you</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer ${currentCategory === 'archived'
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('archived')}
                        >
                            <span className="block">Archived Projects</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer ${currentCategory === 'trashed'
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('trashed')}
                        >
                            <span className="block">Trashed Projects</span>
                        </li>
                    </ul>
                </nav>

                {/* Logout button at bottom of sidebar */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={onLogout}
                        className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                        <LogOut size={16} className="mr-2" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between p-4">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">{getCategoryTitle()}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                className="text-gray-600 hover:text-gray-800 flex items-center"
                                onClick={loadProjects}
                            >
                                <RefreshCw size={16} className="mr-1" />
                                <span>Refresh</span>
                            </button>
                            <a href="#" className="text-gray-600 hover:text-gray-800">Templates</a>
                            <AccountDropdown
                                onLogout={onLogout}
                                onSettings={handleSettings}
                            />
                        </div>
                    </div>
                </header>

                {/* Project List */}
                <div className="flex-1 overflow-auto p-4">
                    {/* Search */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={`Search in ${getCategoryTitle().toLowerCase()}...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Project Table */}
                    <div className="bg-white shadow-sm rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                            checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                        <span className="ml-3">Title</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Modified
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        {searchQuery ? (
                                            <div>
                                                <p>No projects match your search.</p>
                                                <p className="mt-1 text-sm">Try a different search term or clear the search.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p>You don't have any projects in this category yet.</p>
                                                {currentCategory === 'all' && (
                                                    <button
                                                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 inline-flex items-center"
                                                        onClick={handleNewProject}
                                                    >
                                                        <Plus size={16} className="mr-1" />
                                                        <span>Create your first project</span>
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleOpenProject(project.id)}>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                                    checked={selectedProjects.includes(project.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleProjectSelection(project.id);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {project.title}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" onClick={() => handleOpenProject(project.id)}>
                                            <div className="text-sm text-gray-900">{project.owner}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" onClick={() => handleOpenProject(project.id)}>
                                            {ProjectService.formatDate(project.lastModified)} by {project.lastModifiedBy}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                {(currentCategory === 'archived' || currentCategory === 'trashed') ? (
                                                    <button
                                                        className="text-green-500 hover:text-green-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRestoreProject(project.id);
                                                        }}
                                                        title="Restore"
                                                    >
                                                        <RefreshCw size={18} />
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                console.log(`Download project ${project.id}`);
                                                                alert('Download functionality would be implemented here');
                                                            }}
                                                            title="Download"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDuplicateProject(project.id);
                                                            }}
                                                            title="Duplicate"
                                                        >
                                                            <Copy size={18} />
                                                        </button>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleArchiveProject(project.id);
                                                            }}
                                                            title="Archive"
                                                        >
                                                            <Archive size={18} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="text-gray-500 hover:text-gray-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteProject(project.id);
                                                    }}
                                                    title={currentCategory === 'trashed' ? "Delete Permanently" : "Move to Trash"}
                                                >
                                                    <Trash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>

                        {/* Display count */}
                        <div className="px-6 py-3 bg-white border-t border-gray-200 text-sm text-gray-500">
                            Showing {filteredProjects.length} out of {projects.filter(p =>
                            (currentCategory === 'trashed' && p.trashed) ||
                            (currentCategory === 'archived' && p.archived) ||
                            (currentCategory !== 'trashed' && currentCategory !== 'archived' && !p.trashed && !p.archived)
                        ).length} projects.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsDashboard;