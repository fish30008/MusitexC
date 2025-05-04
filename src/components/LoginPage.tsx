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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center">
                        <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span className="ml-2 text-2xl font-bold text-green-600">MusiTeX</span>
                    </div>
                </div>

                {/* Header */}
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
                    Log in to MusiTeX
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

                    {/* Email Field */}
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                        <div className="flex justify-end mt-1">
                            <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                        Log in
                    </button>
                </form>

                {/* Registration Link */}
                <div className="text-center mt-4">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-600 hover:text-green-800 font-medium">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;