@ECHO OFF
start cmd.exe /C "python -m http.server 2627"
start chrome http://127.0.0.1:2627/index.html