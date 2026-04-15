@echo off
setlocal

echo Closing backend server window...
taskkill /FI "WINDOWTITLE eq Backend Server" /T /F >nul 2>&1

echo Closing frontend server window...
taskkill /FI "WINDOWTITLE eq Frontend Server" /T /F >nul 2>&1

echo.
echo Requested shutdown for all server windows.

endlocal
