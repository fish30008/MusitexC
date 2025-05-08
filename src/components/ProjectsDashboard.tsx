import React, { useState, useEffect } from 'react';
import { Download, Copy, Trash, Archive, MoreHorizontal, Plus, RefreshCw, LogOut, Music } from 'lucide-react';
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

    // Custom CSS for piano key effect
    const pianoKeyStyle = `
        .piano-key-effect {
            position: relative;
            transition: all 0.1s ease;
            transform-origin: top center;
        }
        
        .piano-key-effect:hover {
            transform: translateY(2px) scale(0.98);
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .piano-key-effect:active {
            transform: translateY(3px) scale(0.96);
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .pulse-effect {
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
            }
            100% {
                transform: scale(1);
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
            }
        }
        
        .sound-wave-bg {
            background-image: 
                radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg width='100' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 25 Q 25 5 50 25 T 100 25' stroke='%23bfdbfe' fill='none' stroke-width='2' opacity='0.3'/%3E%3C/svg%3E");
            background-size: 100px 50px;
            background-repeat: repeat-x;
            background-position: center;
        }
    `;

    // Musical Note Icon Component
    const MusicalNote = () => (
        <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor" className="inline-block mr-2">
            <path d="M7 0v8.5a2.5 2.5 0 11-1-2V0h1zM1.5 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
    );

    // Sheet Music Icon Component (replacing FileMusic)
    const SheetMusicIcon = ({ size = 16, className = "" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path stroke="#fff" strokeWidth="1.5" d="M14 2v6h6M9 13h6M9 17h6"/>
            <path fill="#fff" d="M12 8h2v2h-2zM12 11h2v2h-2z"/>
        </svg>
    );

    // Treble Clef Icon Component
    const TrebleClef = ({ className = "" }) => (
        <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 2.99 10 3.5 10 4V10.42C9.4 10.15 8.73 10 8 10C5.79 10 4 11.79 4 14S5.79 18 8 18C10.21 18 12 16.21 12 14V7.41L13.41 8.82C13.78 9.19 14.3 9.41 14.84 9.41C15.11 9.41 15.39 9.35 15.64 9.23C16.43 8.88 16.8 8 16.45 7.21L13.59 1C13.41 0.64 13.07 0.39 12.67 0.31C12.45 0.27 12.23 0.25 12 0.25V2M8 12C9.1 12 10 12.9 10 14S9.1 16 8 16S6 15.1 6 14S6.9 12 8 12Z"/>
        </svg>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            <style>{pianoKeyStyle}</style>

            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                        <TrebleClef className="w-8 h-8 text-blue-800" />
                        <div>
                            <h1 className="text-lg font-bold text-blue-800">MusicTex</h1>
                            <p className="text-xs text-gray-500">A Digital Music Solution</p>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <button
                        className="w-full py-2 bg-blue-800 text-white rounded hover:bg-blue-900 flex items-center justify-center piano-key-effect"
                        onClick={handleNewProject}
                    >
                        <Plus size={16} className="mr-1" />
                        <span>New Project</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto">
                    <ul className="p-2">
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer flex items-center ${currentCategory === 'all'
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('all')}
                        >
                            {currentCategory === 'all' && <MusicalNote />}
                            <SheetMusicIcon size={16} className="mr-2" />
                            <span>All Projects</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer flex items-center ${currentCategory === 'yours'
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('yours')}
                        >
                            {currentCategory === 'yours' && <MusicalNote />}
                            <SheetMusicIcon size={16} className="mr-2" />
                            <span>Your Projects</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer flex items-center ${currentCategory === 'shared'
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('shared')}
                        >
                            {currentCategory === 'shared' && <MusicalNote />}
                            <SheetMusicIcon size={16} className="mr-2" />
                            <span>Shared with you</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer flex items-center ${currentCategory === 'archived'
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('archived')}
                        >
                            {currentCategory === 'archived' && <MusicalNote />}
                            <SheetMusicIcon size={16} className="mr-2" />
                            <span>Archived Projects</span>
                        </li>
                        <li
                            className={`px-2 py-1 mb-1 rounded cursor-pointer flex items-center ${currentCategory === 'trashed'
                                ? 'bg-blue-50 text-blue-800'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => handleCategoryChange('trashed')}
                        >
                            {currentCategory === 'trashed' && <MusicalNote />}
                            <SheetMusicIcon size={16} className="mr-2" />
                            <span>Trashed Projects</span>
                        </li>
                    </ul>
                </nav>

                {/* Logout button at bottom of sidebar */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={onLogout}
                        className="w-full py-2 text-gray-700 hover:bg-gray-100 rounded flex items-center justify-center piano-key-effect"
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
                                className="text-gray-600 hover:text-gray-800 flex items-center piano-key-effect px-3 py-1 rounded"
                                onClick={loadProjects}
                            >
                                <RefreshCw size={16} className="mr-1" />
                                <span>Refresh</span>
                            </button>
                            <a href="#" className="text-gray-600 hover:text-gray-800 piano-key-effect px-3 py-1 rounded">Templates</a>
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
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <div className="sound-wave-bg py-8">
                                            {searchQuery ? (
                                                <div>
                                                    <Music size={48} className="mx-auto mb-4 text-gray-400" />
                                                    <p>No projects match your search.</p>
                                                    <p className="mt-1 text-sm">Try a different search term or clear the search.</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Music size={48} className="mx-auto mb-4 text-gray-400" />
                                                    <p>You don't have any projects in this category yet.</p>
                                                    {currentCategory === 'all' && (
                                                        <button
                                                            className="mt-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 inline-flex items-center piano-key-effect"
                                                            onClick={handleNewProject}
                                                        >
                                                            <Plus size={16} className="mr-1" />
                                                            <span>Create your first project</span>
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
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
                                            <div className="flex justify-end space-x-2">
                                                {(currentCategory === 'archived' || currentCategory === 'trashed') ? (
                                                    <button
                                                        className="text-blue-700 hover:text-blue-900 piano-key-effect p-1 rounded"
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
                                                            className="text-gray-500 hover:text-gray-700 piano-key-effect p-1 rounded"
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
                                                            className="text-gray-500 hover:text-gray-700 piano-key-effect p-1 rounded"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDuplicateProject(project.id);
                                                            }}
                                                            title="Duplicate"
                                                        >
                                                            <Copy size={18} />
                                                        </button>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700 piano-key-effect p-1 rounded"
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
                                                    className="text-gray-500 hover:text-gray-700 piano-key-effect p-1 rounded"
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