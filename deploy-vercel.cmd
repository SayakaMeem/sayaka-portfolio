@echo off
setlocal
cd /d %~dp0

echo Linking this folder to the Vercel project "sayaka-portfolio"...
call npx vercel@latest link --yes --project sayaka-portfolio --scope sayakameems-projects || goto :error

echo.
echo Deploying production build...
call npx vercel@latest --prod || goto :error

echo.
echo Deployment completed.
pause
goto :eof

:error
echo.
echo Deployment failed. Review the Vercel output above.
pause
exit /b 1
