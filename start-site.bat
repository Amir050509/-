@echo off
setlocal
cd /d "%~dp0"
title Krug Social - local server

where php >nul 2>nul
if errorlevel 1 (
    echo PHP is not installed or is missing from PATH.
    echo Install XAMPP and make sure its PHP folder is in PATH.
    pause
    exit /b 1
)

where composer >nul 2>nul
if errorlevel 1 (
    echo Composer is not installed or is missing from PATH.
    pause
    exit /b 1
)

if not exist "vendor\autoload.php" (
    echo Installing project dependencies...
    composer install
    if errorlevel 1 goto failed
)

echo Preparing the database...
php yii migrate --interactive=0
if errorlevel 1 goto failed

start "" /b cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:8080/"
echo Site is starting. Keep this window open while using it.
echo Press Ctrl+C here to stop the site.
composer run-script serve
goto done

:failed
echo.
echo The site could not start. Read the error above.
pause

:done
endlocal
