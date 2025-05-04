import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import IWorkplace from './components/Iworkplace';
import ProjectsDashboard from './components/ProjectsDashboard';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import AuthService from './components/services/AuthService';

// Editor wrapper to handle navigation and params
const EditorWrapper = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Check auth on mount
    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    const handleNavigateToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <IWorkplace
            onNavigateToDashboard={handleNavigateToDashboard}
            projectId={projectId}
        />
    );
};

// Dashboard wrapper to handle navigation
const DashboardWrapper = () => {
    const navigate = useNavigate();

    // Check auth on mount
    useEffect(() => {
        if (!AuthService.isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    const handleNavigateToEditor = (projectId?: string) => {
        if (projectId) {
            navigate(`/editor/${projectId}`);
        } else {
            navigate('/editor');
        }
    };

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    return (
        <ProjectsDashboard
            onNavigateToEditor={handleNavigateToEditor}
            onLogout={handleLogout}
        />
    );
};

function App() {
    // Force a check of authentication on app startup
    const checkAuthentication = () => {
        return AuthService.isAuthenticated();
    };

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuthentication());

    // Watch for authentication changes
    useEffect(() => {
        const checkAuth = () => {
            const authStatus = checkAuthentication();
            setIsAuthenticated(authStatus);
        };

        // Check auth initially
        checkAuth();

        // Set up an interval to check auth status periodically
        const intervalId = setInterval(checkAuth, 1000);

        // Listen for storage events (in case token is removed in another tab)
        const handleStorageChange = () => {
            checkAuth();
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <Router>
            <div className="App" style={{ height: '100vh', overflow: 'hidden' }}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    <Route path="/dashboard" element={<DashboardWrapper />} />
                    <Route path="/editor/:projectId?" element={<EditorWrapper />} />

                    {/* Default routes */}
                    <Route path="/" element={
                        isAuthenticated ? (
                            <Navigate to="/dashboard" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    } />

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;