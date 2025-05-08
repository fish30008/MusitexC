import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from './services/AuthService';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Initialize with demo user on component mount
    useEffect(() => {
        AuthService.initializeWithDemoUser();

        // Check if already logged in
        if (AuthService.isAuthenticated()) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            // Attempt to login
            const user = AuthService.login(email, password);

            if (!user) {
                setError('Invalid email or password.');
                return;
            }

            // Force a reload of the page after login to ensure authentication state is updated
            window.location.href = '/dashboard';
        } catch (err) {
            setError('An error occurred during login. Please try again.');
            console.error('Login error:', err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Treble Clef Icon Component
    const TrebleClef = ({ className = "" }) => (
        <svg className={className} width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 2 11 2.19 10.59 2.59C10.2 2.99 10 3.5 10 4V10.42C9.4 10.15 8.73 10 8 10C5.79 10 4 11.79 4 14S5.79 18 8 18C10.21 18 12 16.21 12 14V7.41L13.41 8.82C13.78 9.19 14.3 9.41 14.84 9.41C15.11 9.41 15.39 9.35 15.64 9.23C16.43 8.88 16.8 8 16.45 7.21L13.59 1C13.41 0.64 13.07 0.39 12.67 0.31C12.45 0.27 12.23 0.25 12 0.25V2M8 12C9.1 12 10 12.9 10 14S9.1 16 8 16S6 15.1 6 14S6.9 12 8 12Z"/>
        </svg>
    );

    // Musical Note Icons
    const MusicNote = ({ className = "" }) => (
        <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 0v11.2a2.5 2.5 0 11-1-2V0h1zM2.5 14a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
    );

    const QuarterNote = ({ className = "" }) => (
        <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 0v11.5a2.5 2.5 0 01-2.5 2.5 2.5 2.5 0 01-2.5-2.5 2.5 2.5 0 012.5-2.5c.3 0 .59.05.85.14V3L5 4.5v9a2.5 2.5 0 01-2.5 2.5A2.5 2.5 0 010 13.5 2.5 2.5 0 012.5 11c.3 0 .59.05.85.14V2.5L14 0z"/>
        </svg>
    );

    // CSS for animations
    const styles = `
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes drift {
            0% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(10px, -10px) rotate(5deg); }
            66% { transform: translate(-10px, 5px) rotate(-5deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        .floating-note {
            position: absolute;
            animation: float 6s ease-in-out infinite;
            opacity: 0.3;
        }
        
        .drifting-note {
            position: absolute;
            animation: drift 8s ease-in-out infinite;
            opacity: 0.25;
        }
        
        .input-icon {
            transition: all 0.3s ease;
        }
        
        .input-focus:focus-within .input-icon {
            transform: scale(1.1);
            color: #1e40af;
        }
    `;

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 overflow-hidden">
            <style>{styles}</style>

            {/* Floating musical notes */}
            <div className="floating-note top-10 left-10 text-blue-400">
                <MusicNote className="w-8 h-8" />
            </div>
            <div className="floating-note top-20 right-20 text-purple-400" style={{ animationDelay: '2s' }}>
                <QuarterNote className="w-6 h-6" />
            </div>
            <div className="drifting-note top-32 left-40 text-indigo-400" style={{ animationDelay: '1s' }}>
                <MusicNote className="w-10 h-10" />
            </div>
            <div className="floating-note top-16 right-32 text-violet-400" style={{ animationDelay: '3s' }}>
                <QuarterNote className="w-7 h-7" />
            </div>
            <div className="drifting-note top-40 left-20 text-pink-400" style={{ animationDelay: '4s' }}>
                <MusicNote className="w-8 h-8" />
            </div>
            <div className="floating-note bottom-20 left-20 text-teal-400" style={{ animationDelay: '3s' }}>
                <QuarterNote className="w-10 h-10" />
            </div>
            <div className="drifting-note bottom-32 right-16 text-cyan-400" style={{ animationDelay: '1s' }}>
                <MusicNote className="w-7 h-7" />
            </div>
            <div className="floating-note bottom-10 right-40 text-purple-400" style={{ animationDelay: '2s' }}>
                <QuarterNote className="w-9 h-9" />
            </div>
            <div className="drifting-note bottom-40 left-32 text-rose-400" style={{ animationDelay: '4s' }}>
                <MusicNote className="w-6 h-6" />
            </div>
            <div className="floating-note middle left-8 text-violet-400" style={{ top: '50%', animationDelay: '3s' }}>
                <QuarterNote className="w-7 h-7" />
            </div>
            <div className="drifting-note middle right-12 text-blue-400" style={{ top: '40%', animationDelay: '2s' }}>
                <MusicNote className="w-6 h-6" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo with animation */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center group">
                        <TrebleClef className="w-10 h-10 text-blue-800 transform transition-transform group-hover:scale-110" />
                        <span className="ml-2 text-2xl font-bold text-blue-800">MusicTex</span>
                    </div>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Log in to MusicTex
                </h1>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Demo User Info */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded text-sm">
                        <p><strong>Demo Account:</strong></p>
                        <p>Email: demo@musictex.com</p>
                        <p>Password: password123</p>
                    </div>

                    {/* Email Field with icon */}
                    <div className="mb-6 input-focus">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <QuarterNote className="h-4 w-4 text-gray-400 input-icon" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Field with icon */}
                    <div className="mb-6 input-focus">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MusicNote className="h-4 w-4 text-gray-400 input-icon" />
                            </div>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none hover:text-blue-600 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button with hover effect */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-800 text-white font-semibold rounded-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Log in
                    </button>
                </form>

                {/* Registration Link */}
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;