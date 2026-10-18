@echo off
title WoW Top 10 Analyzer
echo ========================================================
echo        Iniciando WoW Mythic+ Top 10 Analyzer...
echo ========================================================
echo.
echo Iniciando servidor local con proxy de APIs en puerto 8088...
echo Abriendo aplicacion en tu navegador...
start http://localhost:8088/index.html
echo.
echo ========================================================
echo   Servidor activo en: http://localhost:8088
echo   No cierres esta ventana mientras uses la aplicacion.
echo   Presiona Ctrl+C para detener el servidor.
echo ========================================================
echo.
python server.py
pause
