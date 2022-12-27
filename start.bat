@echo off
rem Get the first argument passed to the script
set dbfile=%1

set port=8082

rem Find the process ID of the process listening on the specified port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r ":%port% .*LISTENING"') do set pid=%%a

rem Kill the process
taskkill /F /PID %pid%

npm i && npm start -- --dbfile=%dbfile%
