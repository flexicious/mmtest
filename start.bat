@echo off
rem Get the first argument passed to the script
set dbfile=%1

netstat -aon | findstr /r :3333

rem Find the process ID of the process listening on the specified port
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r :3333') do set pid=%%a
echo killing %pid%
rem Kill the process
if defined pid (
taskkill /F /PID %pid%
) else (
  echo No process found listening on port 3333
)

npm i && npm start %dbfile%
