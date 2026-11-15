@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Necesitas instalar Node.js para abrir el sistema.
  pause
  exit /b 1
)
if not exist "build\index.html" (
  echo Falta la version compilada. Usa el paquete listo para usar.
  echo Para desarrollar: npm ci y npm run build.
  pause
  exit /b 1
)
node scripts\serve_local.mjs --open
pause
