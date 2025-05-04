import React from 'react';

interface MusicStaffRendererProps {
    code: string;
    hasError: boolean;
    isLoading: boolean;
}

const MusicStaffRenderer: React.FC<MusicStaffRendererProps> = ({ code, hasError, isLoading }) => {
    // Constants for staff dimensions
    const STAFF_HEIGHT = 40;
    const STAFF_GAP = 40;
    const MARGIN_TOP = 10;
    const NOTES_PER_STAFF = 16; // Maximum notes per staff before creating a new one

    // Function to count notes in the code
    const countNotes = (codeString: string) => {
        const noteRegex = /([A-G][#b]?[0-9])/g;
        const matches = codeString.match(noteRegex) || [];
        return matches.length;
    };

    // Calculate number of staves needed
    const calculateStaves = () => {
        if (hasError || isLoading) return 1;

        const noteCount = countNotes(code);
        const minStaves = 1; // Always show at least one staff
        const calculatedStaves = Math.ceil(noteCount / NOTES_PER_STAFF);

        return Math.max(minStaves, calculatedStaves);
    };

    // Generate the staves
    const renderStaves = () => {
        const numberOfStaves = calculateStaves();
        const totalHeight = (STAFF_HEIGHT + STAFF_GAP) * numberOfStaves;

        // Create array of staff elements
        const staves = [];

        for (let i = 0; i < numberOfStaves; i++) {
            const yOffset = MARGIN_TOP + i * (STAFF_HEIGHT + STAFF_GAP);

            // Add the 5 horizontal lines for each staff
            for (let j = 0; j < 5; j++) {
                const y = yOffset + j * 10;
                staves.push(
                    <line
                        key={`staff-${i}-line-${j}`}
                        x1="2"
                        y1={y}
                        x2="98"
                        y2={y}
                        stroke="black"
                        strokeWidth="0.5"
                    />
                );
            }

            // Add vertical bar lines at beginning and end
            staves.push(
                <line
                    key={`staff-${i}-bar-start`}
                    x1="2"
                    y1={yOffset}
                    x2="2"
                    y2={yOffset + 40}
                    stroke="black"
                    strokeWidth="0.5"
                />
            );

            staves.push(
                <line
                    key={`staff-${i}-bar-end`}
                    x1="98"
                    y1={yOffset}
                    x2="98"
                    y2={yOffset + 40}
                    stroke="black"
                    strokeWidth="0.5"
                />
            );
        }

        return {
            staves,
            height: totalHeight + MARGIN_TOP // Add some bottom margin
        };
    };

    // Render loading or error states
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <div className="text-gray-500">Processing music notation...</div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex items-center justify-center h-40">
                <div className="text-red-500">Cannot render sheet music due to errors</div>
            </div>
        );
    }

    // Render the dynamic staves
    const { staves, height } = renderStaves();

    return (
        <div className="flex flex-col items-center w-full px-6 overflow-auto">
            <svg
                width="100%"
                height={height}
                viewBox={`0 0 100 ${height}`}
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {staves}
            </svg>

            <div className="mt-4 text-sm text-gray-600">
                Staff will automatically expand based on your music content.
            </div>
        </div>
    );
};

export default MusicStaffRenderer;