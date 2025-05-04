@echo off
echo Starting MusiTeX setup...

REM Check if Node.js is installed
WHERE node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed! Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Node.js is installed.

REM Check if project is already set up (package.json exists)
IF EXIST package.json (
    echo Existing project detected, installing dependencies...
    call npm install
) ELSE (
    echo Creating new React TypeScript application...

    REM Create React App with TypeScript template
    call npx create-react-app . --template typescript

    REM Install required dependencies
    echo Installing required dependencies...
    call npm install react-router-dom
    call npm install lucide-react
    call npm install tailwindcss postcss autoprefixer
    call npx tailwindcss init -p

    REM Set up Tailwind CSS
    echo Setting up Tailwind CSS...
    echo @tailwind base; > src\index.css
    echo @tailwind components; >> src\index.css
    echo @tailwind utilities; >> src\index.css

    REM Configure tailwind.config.js
    echo module.exports = { > tailwind.config.js
    echo   content: ["./src/**/*.{js,jsx,ts,tsx}"], >> tailwind.config.js
    echo   theme: { >> tailwind.config.js
    echo     extend: {}, >> tailwind.config.js
    echo   }, >> tailwind.config.js
    echo   plugins: [], >> tailwind.config.js
    echo }; >> tailwind.config.js

    REM Create directory structure if it doesn't exist
    IF NOT EXIST src\components mkdir src\components
    IF NOT EXIST src\components\services mkdir src\components\services
    IF NOT EXIST src\services mkdir src\services
)

REM Start the development server
echo Setup complete!
echo Starting development server...
call npm start

echo If the browser didn't open automatically, please navigate to http://localhost:3000