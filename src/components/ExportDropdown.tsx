import React, { useState, useRef, useEffect } from 'react';
import { FileDown, ChevronDown, FileText, Music } from 'lucide-react';

interface ExportDropdownProps {
    onExportPDF: () => void;
    onExportMIDI: () => void;
    theme: 'light' | 'dark';
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExportPDF, onExportMIDI, theme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-2 py-1 rounded flex items-center space-x-1 ${
                    theme === 'dark'
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                } transition-colors`}
            >
                <FileDown size={16} />
                <span>Export</span>
                <ChevronDown size={14} className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                        <button
                            onClick={() => {
                                onExportPDF();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                            <FileText size={16} className="text-red-500" />
                            <span>Export as PDF</span>
                        </button>

                        <button
                            onClick={() => {
                                onExportMIDI();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                            <Music size={16} className="text-blue-500" />
                            <span>Export as MIDI</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExportDropdown;