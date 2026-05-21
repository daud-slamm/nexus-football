@echo off
echo ========================================
echo    Claude Assistant - Iniciando app...
echo ========================================
echo.
echo [1/2] Iniciando backend (puerto 3001)...
start "Backend - NO CERRAR" cmd /k "cd /d "%~dp0server" && npm run dev"
echo Esperando 3 segundos...
timeout /t 3 /nobreak > nul
echo [2/2] Iniciando frontend (puerto 5173)...
start "Frontend - NO CERRAR" cmd /k "cd /d "%~dp0client" && npm run dev"
echo Esperando 4 segundos...
timeout /t 4 /nobreak > nul
echo.
echo Abriendo navegador...
start http://localhost:5173
echo.
echo Listo! La app esta en http://localhost:5173
echo NO cierres las ventanas del Backend y Frontend.
pause
