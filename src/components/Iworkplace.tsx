import React, { useState, useEffect, useRef } from 'react';
import { Camera, GripVertical, ArrowLeft, Save } from 'lucide-react';
import MusicStaffRenderer from './MusicStaffRenderer';
import ProjectService from './services/ProjectService';
import AccountDropdown from './AccountDropdown';

// TypeScript interfaces
interface ParseResult {
    hasError: boolean;
    errorLine: number;
    errorMessage: string;
    sheetMusicImage: string | null;
}

interface IWorkplaceProps {
    onNavigateToDashboard: () => void;
    projectId?: string;
}

const IWorkplace: React.FC<IWorkplaceProps> = ({ onNavigateToDashboard, projectId }) => {
    const [projectTitle, setProjectTitle] = useState('Untitled Project');
    const [code, setCode] = useState('// Write your Music DSL code here\n\nplay C4 D4 E4 F4 G4 A4 B4 C5');
    const [originalCode, setOriginalCode] = useState(code);
    const [originalTitle, setOriginalTitle] = useState(projectTitle);
    const [parseResult, setParseResult] = useState<ParseResult>({
        hasError: false,
        errorLine: -1,
        errorMessage: '',
        sheetMusicImage: null
    });
    const [theme, setTheme] = useState('light');
    const [isLoading, setIsLoading] = useState(false);
    const [editorWidth, setEditorWidth] = useState(50); // Initial split at 50%
    const [isSaved, setIsSaved] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    // Account dropdown handlers
    const handleLogout = () => {
        alert('Logout functionality would be implemented here');
        // In a real app, you would clear the auth token and redirect to login page
    };

    const handleSettings = () => {
        alert('Account settings would be implemented here');
        // In a real app, you would navigate to the settings page
    };

    // Load project on mount if projectId is provided
    useEffect(() => {
        if (projectId) {
            const project = ProjectService.getProjectById(projectId);
            if (project) {
                setProjectTitle(project.title);
                setCode(project.content);
                // Store original values to compare against
                setOriginalCode(project.content);
                setOriginalTitle(project.title);
                setIsSaved(true);
            }
        } else {
            // Create a new project
            const newProject = ProjectService.createProject('Untitled Project', code);
            setProjectTitle(newProject.title);
            // Store original values to compare against
            setOriginalCode(code);
            setOriginalTitle(newProject.title);
            setIsSaved(true);
        }
    }, [projectId]);

    // Track changes and update saved state
    useEffect(() => {
        // Only mark as unsaved if content has actually changed
        const contentChanged = code !== originalCode || projectTitle !== originalTitle;
        setIsSaved(!contentChanged);
    }, [code, projectTitle, originalCode, originalTitle]);

    // This would be replaced with actual API call to your Python backend
    const processCode = async (codeToProcess: string) => {
        setIsLoading(true);

        // Simulating API call to Python backend
        try {
            // Mock backend response - in reality, this would come from your Python service
            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

            const mockResponse: ParseResult = {
                hasError: codeToProcess.includes('error'),
                errorLine: codeToProcess.includes('error')
                    ? codeToProcess.split('\n').findIndex(line => line.includes('error'))
                    : -1,
                errorMessage: codeToProcess.includes('error') ? 'Syntax error in note sequence' : '',
                // In reality, this could be a base64 image string of rendered sheet music from your Python backend
                sheetMusicImage: !codeToProcess.includes('error')
                    ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Music-staff.svg/640px-Music-staff.svg.png'
                    : null
            };

            setParseResult(mockResponse);
        } catch (error) {
            setParseResult({
                hasError: true,
                errorLine: -1,
                errorMessage: 'Failed to communicate with the music compiler service',
                sheetMusicImage: null
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize resizer functionality
    useEffect(() => {
        const resizer = document.getElementById('resizer');
        if (!resizer) return;

        const leftPanel = resizer.previousElementSibling;
        const rightPanel = resizer.nextElementSibling;
        if (!leftPanel || !rightPanel) return;

        // Update CSS variables for initial rendering
        document.documentElement.style.setProperty('--editor-width', `${editorWidth}%`);
        document.documentElement.style.setProperty('--preview-width', `${100 - editorWidth}%`);
        document.documentElement.style.setProperty('--resizer-position', `${editorWidth}%`);

        // Track whether we're actively resizing
        let isResizing = false;

        const startResizing = (e: MouseEvent) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.addEventListener('selectstart', preventSelection);
        };

        const stopResizing = () => {
            isResizing = false;
            document.body.style.cursor = '';
            document.removeEventListener('selectstart', preventSelection);
        };

        const preventSelection = (e: Event) => {
            e.preventDefault();
        };

        const resize = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;

            // Calculate the position of the resizer
            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width;

            // Calculate the new width as a percentage
            let newWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;

            // Limit the minimum width to avoid panels getting too small
            newWidth = Math.max(20, Math.min(80, newWidth));

            // Update the state
            setEditorWidth(newWidth);

            // Update CSS variables
            document.documentElement.style.setProperty('--editor-width', `${newWidth}%`);
            document.documentElement.style.setProperty('--preview-width', `${100 - newWidth}%`);
            document.documentElement.style.setProperty('--resizer-position', `${newWidth}%`);
        };

        // Add event listeners
        resizer.addEventListener('mousedown', startResizing);
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);

        // Clean up
        return () => {
            resizer.removeEventListener('mousedown', startResizing);
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResizing);
            document.removeEventListener('selectstart', preventSelection);
        };
    }, [editorWidth]);

    useEffect(() => {
        // Parse code whenever it changes (with debounce)
        const timer = setTimeout(() => {
            processCode(code);
        }, 500);

        return () => clearTimeout(timer);
    }, [code]);

    // Handle code changes
    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
    };

    // Handle title changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProjectTitle(e.target.value);
    };

    // Toggle theme
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Run the code manually
    const handleRunCode = () => {
        processCode(code);
    };

    // Save the code
    const handleSaveCode = () => {
        if (projectId) {
            ProjectService.updateProject(projectId, {
                title: projectTitle,
                content: code
            });
            // Update the original values after saving
            setOriginalCode(code);
            setOriginalTitle(projectTitle);
            setIsSaved(true);
        } else {
            // Create new project if somehow we don't have an ID
            const newProject = ProjectService.createProject(projectTitle, code);
            // Update the original values after saving
            setOriginalCode(code);
            setOriginalTitle(projectTitle);
            setIsSaved(true);
        }
    };

    // Navigate back to dashboard with confirmation if unsaved
    const handleNavigateBack = () => {
        if (!isSaved) {
            const confirmLeave = window.confirm('You have unsaved changes. Are you sure you want to leave?');
            if (!confirmLeave) {
                return;
            }
        }
        onNavigateToDashboard();
    };

    // Generate line numbers for the editor
    const lineNumbers = code.split('\n').map((_, index) => (
        <div
            key={index}
            className={`text-right pr-2 select-none ${
                parseResult && parseResult.errorLine === index ? 'bg-red-200' : ''
            }`}
        >
            {index + 1}
        </div>
    ));

    // Define CSS for our component
    const styles = {
        container: `flex flex-col h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`,
        toolbar: `p-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-200'} flex justify-between items-center`,
        mainContent: 'flex flex-1 overflow-hidden relative',
        editorPanel: `flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-r ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`,
        editorHeader: 'p-2 border-b text-sm font-medium flex justify-between items-center',
        lineNumbers: `py-2 text-xs ${theme === 'dark' ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-600'}`,
        codeEditor: `flex-1 p-2 text-sm font-mono outline-none resize-none ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-white'}`,
        problemsPanel: `p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} text-sm max-h-28 overflow-auto border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`,
        previewPanel: `overflow-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`,
        statusBar: `px-4 py-1 text-xs ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-gray-200 text-gray-600'} flex justify-between`,
        resizer: `absolute top-0 bottom-0 w-1 cursor-col-resize flex items-center justify-center z-10 hover:bg-blue-400 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`
    };

    return (
        <div
            ref={containerRef}
            className={styles.container}
        >
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleNavigateBack}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <ArrowLeft size={18} />
                        <span className="ml-1">Back to Projects</span>
                    </button>

                    <div className="flex items-center space-x-2">
                        <Camera size={24} />
                        <input
                            type="text"
                            value={projectTitle}
                            onChange={handleTitleChange}
                            className={`text-lg font-bold bg-transparent border ${isSaved ? 'border-transparent' : 'border-yellow-400'} focus:border-blue-500 focus:outline-none px-1 rounded`}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}
                    >
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                    <button
                        onClick={handleRunCode}
                        className={`px-2 py-1 rounded ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} text-white`}
                    >
                        Run
                    </button>
                    <button
                        onClick={handleSaveCode}
                        className={`px-2 py-1 rounded flex items-center ${isSaved
                            ? (theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-300 text-gray-500')
                            : (theme === 'dark' ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                        }`}
                        disabled={isSaved}
                    >
                        <Save size={16} className="mr-1" />
                        <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                    <AccountDropdown
                        onLogout={handleLogout}
                        onSettings={handleSettings}
                    />
                </div>
            </div>

            {/* Main content with resizable panels */}
            <div className={styles.mainContent}>
                {/* Code editor side */}
                <div
                    className={styles.editorPanel}
                    style={{ width: 'var(--editor-width, 50%)' }}
                >
                    <div className={styles.editorHeader}>
                        <span>main.mdsl</span>
                        <div className="text-xs">
                            {parseResult.hasError ? (
                                <span className="text-red-500">● 1 Error</span>
                            ) : (
                                <span className="text-green-500">✓ No Errors</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-auto">
                        {/* Line numbers */}
                        <div className={styles.lineNumbers}>
                            {lineNumbers}
                        </div>

                        {/* Code editor */}
                        <textarea
                            value={code}
                            onChange={handleCodeChange}
                            className={styles.codeEditor}
                            spellCheck={false}
                        />
                    </div>

                    {/* Problems panel */}
                    {parseResult.hasError && (
                        <div className={styles.problemsPanel}>
                            <div className="font-medium mb-1">Problems</div>
                            <div className="flex items-start">
                                <div className="text-red-500 mr-2">●</div>
                                <div>
                                    <div className="font-medium">{parseResult.errorMessage}</div>
                                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        main.mdsl:line {parseResult.errorLine + 1}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resizer handle */}
                <div
                    id="resizer"
                    className={styles.resizer}
                    style={{ left: 'var(--resizer-position, 50%)', marginLeft: '-2px', width: '4px' }}
                >
                    <GripVertical className="text-gray-500" size={16} />
                </div>

                {/* Sheet music side */}
                <div
                    className={styles.previewPanel}
                    style={{ width: 'var(--preview-width, 50%)' }}
                >
                    <div className="p-4">
                        <div className="border-b border-gray-300 pb-2 mb-4">
                            <h2 className="text-xl font-semibold">Sheet Music Preview</h2>
                        </div>

                        <div className="bg-white p-4 rounded shadow">
                            <MusicStaffRenderer
                                code={code}
                                hasError={parseResult.hasError}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Status bar */}
            <div className={styles.statusBar}>
                <div>Music DSL Editor v1.0</div>
                <div className="flex items-center">
                    {isLoading ? 'Processing...' : parseResult.hasError ? '1 Error' : 'Ready'}
                    {!isSaved &&
                        <span className="ml-2 text-yellow-500">●</span>
                    }
                </div>
            </div>
        </div>
    );
};

export default IWorkplace;