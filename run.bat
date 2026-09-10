@echo off
echo Compiling MyString project...
g++ -Wall -Wextra Main.cpp MyString.cpp -o MyString.exe
if %ERRORLEVEL% equ 0 (
    echo Compilation successful!
    echo.
    echo Running MyString.exe:
    echo --------------------------------------------------
    MyString.exe
) else (
    echo Compilation failed with error code %ERRORLEVEL%.
)
