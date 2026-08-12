@echo off
setlocal
cd /d %~dp0

where node >nul 2>nul || (
  echo Node.js is not installed or not available in PATH.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install || goto :error
)

if not exist .env.local (
  copy .env.example .env.local >nul
  echo Created .env.local from .env.example
)

echo.
echo Starting Sayaka portfolio at http://localhost:4000
echo Press Ctrl+C to stop.
echo.
call npm run dev
goto :eof

:error
echo.
echo Setup failed. Review the npm error above.
pause
exit /b 1
