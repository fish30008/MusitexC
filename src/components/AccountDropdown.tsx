import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import AuthService from './services/AuthService';

interface AccountDropdownProps {
    userEmail?: string;
    onLogout: () => void;
    onSettings: () => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({
                                                             userEmail,
                                                             onLogout,
                                                             onSettings
                                                         }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // Get current user email on mount
    useEffect(() => {
        // If userEmail prop is provided, use it
        if (userEmail) {
            setCurrentUser(userEmail);
        } else {
            // Otherwise get it from auth service
            const user = AuthService.getCurrentUser();
            if (user) {
                setCurrentUser(user.email);
            } else {
                setCurrentUser('user@example.com');
            }
        }
    }, [userEmail]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Avatar button */}
            <button
                className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                title="Account"
            >
                <User size={16} className="text-green-600" />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                    {/* User email */}
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">
                        {currentUser || 'user@example.com'}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                        <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                                setIsOpen(false);
                                onSettings();
                            }}
                        >
                            <Settings size={16} className="mr-2" />
                            Account Settings
                        </button>

                        <button
                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center"
                            onClick={() => {
                                setIsOpen(false);
                                onLogout();
                            }}
                        >
                            <LogOut size={16} className="mr-2" />
                            Log Out
                            <span className="ml-auto">→</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountDropdown;