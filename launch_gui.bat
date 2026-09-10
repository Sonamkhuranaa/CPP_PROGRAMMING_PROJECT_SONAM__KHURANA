@echo off
title MyString Studio - C++ OOP Workbench
echo ======================================================
echo          Starting MyString Studio Interface
echo ======================================================
echo Checking C++ executable...
if not exist "MyString.exe" (
    echo Compiling MyString.exe...
    g++ -Wall -Wextra Main.cpp MyString.cpp -o MyString.exe
)

echo Starting local web server on port 5050...
start "" http://127.0.0.1:5050
python -u server.py
pause
