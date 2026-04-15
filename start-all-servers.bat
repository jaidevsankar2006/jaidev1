@echo off
setlocal

set "ROOT_DIR=%~dp0"

echo Closing any previous server windows...
taskkill /FI "WINDOWTITLE eq Backend Server" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Frontend Server" /T /F >nul 2>&1

echo Starting backend server...
start "Backend Server" cmd /k "cd /d ""%ROOT_DIR%backend"" && npm start"

echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d ""%ROOT_DIR%frontend"" && npm run dev"

echo.
echo Both servers have been launched in separate windows.
echo Close those windows to stop the servers.

endlocal
