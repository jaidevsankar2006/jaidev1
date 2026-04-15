@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "SCHEMA_FILE=%ROOT_DIR%backend\database\schema.sql"
set "SEED_FILE=%ROOT_DIR%backend\database\seed.sql"

echo MySQL setup for Optimized Retail Inventory Management System
echo.

set /p MYSQL_USER=Enter MySQL username [root]: 
if "%MYSQL_USER%"=="" set "MYSQL_USER=root"

set /p MYSQL_DB=Enter database name [optimized_retail_inventory]: 
if "%MYSQL_DB%"=="" set "MYSQL_DB=optimized_retail_inventory"

set /p MYSQL_PASSWORD=Enter MySQL password [leave blank for none]: 

where mysql >nul 2>&1
if errorlevel 1 (
  echo.
  echo mysql command not found.
  echo Add MySQL bin folder to PATH, then run this file again.
  exit /b 1
)

echo.
echo Importing schema...
if "%MYSQL_PASSWORD%"=="" (
  mysql -u "%MYSQL_USER%" < "%SCHEMA_FILE%"
) else (
  mysql -u "%MYSQL_USER%" -p"%MYSQL_PASSWORD%" < "%SCHEMA_FILE%"
)

if errorlevel 1 (
  echo.
  echo Schema import failed.
  exit /b 1
)

echo Importing seed data into %MYSQL_DB%...
if "%MYSQL_PASSWORD%"=="" (
  mysql -u "%MYSQL_USER%" "%MYSQL_DB%" < "%SEED_FILE%"
) else (
  mysql -u "%MYSQL_USER%" -p"%MYSQL_PASSWORD%" "%MYSQL_DB%" < "%SEED_FILE%"
)

if errorlevel 1 (
  echo.
  echo Seed import failed.
  exit /b 1
)

echo.
echo MySQL setup completed successfully.
echo Update backend\.env if your credentials or database name are different.

endlocal
