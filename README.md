# COLORCODE — C++ MyString OOP Architecture & Memory Visualizer

[![Language](https://img.shields.io/badge/Language-C%2B%2B%20%7C%20C%2B%2B17-blue.svg)](https://isocpp.org/)
[![Compiler](https://img.shields.io/badge/Compiler-GCC%20%2F%20MinGW-orange.svg)](https://www.mingw-w64.org/)
[![GUI Server](https://img.shields.io/badge/GUI%20Bridge-Python%203-brightgreen.svg)](https://www.python.org/)
[![UI](https://img.shields.io/badge/UI-Vanilla%20HTML5%20%2F%20CSS3-purple.svg)](frontend/)
[![License](https://img.shields.io/badge/License-Academic%20Project-lightgrey.svg)](#author)

A comprehensive, production-grade custom **`MyString`** class implemented from scratch in **C++** using **Object-Oriented Programming (OOP)**, accompanied by **ColorCode Studio** — an interactive web workbench with real-time stack/heap memory visualization, deep copy isolation inspection, and native binary execution.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Memory Model & The Rule of Three](#memory-model--the-rule-of-three)
- [Operator Overloading Matrix](#operator-overloading-matrix)
- [ColorCode Interactive Web Studio](#colorcode-interactive-web-studio)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
  - [Option 1: Interactive GUI Studio (Recommended)](#option-1-interactive-gui-studio-recommended)
  - [Option 2: Command Line (CLI) Batch Script](#option-2-command-line-cli-batch-script)
  - [Option 3: Manual Compilation & Execution](#option-3-manual-compilation--execution)
- [Sample Execution Output](#sample-execution-output)
- [Automated Test Suite](#automated-test-suite)
- [OOP Concepts Demonstrated](#oop-concepts-demonstrated)
- [Author & Acknowledgements](#author--acknowledgements)

---

## Overview

In modern C++, `std::string` manages character buffers automatically. This project builds a custom `MyString` class entirely from raw character arrays (`char*`) and dynamic heap memory (`new` and `delete[]`) **without using `std::string` or `<cstring>` functions internally**.

It solves real-world systems programming challenges including:
- Dynamic buffer resizing and zero-terminated string handling.
- Preventing memory leaks and dangling pointer errors.
- Deep copy safety vs shallow copy pitfalls (avoiding double-free crashes).
- Custom stream insertion (`<<`) and extraction (`>>`) operators.

---

## Key Features

- **Zero Standard Library String Dependency:** Custom low-level string utilities (`stringLength`, `copyString`, `compareString`).
- **Dynamic Memory Allocation:** Uses `new char[len + 1]` and clean deallocation with `delete[]`.
- **Full Rule of Three Compliance:**
  - Destructor: `~MyString()`
  - Copy Constructor: `MyString(const MyString& other)`
  - Copy Assignment Operator: `operator=(const MyString& other)` with self-assignment guard.
- **Rich Operator Overloading:**
  - String concatenation (`+`)
  - Relational comparison (`==`, `!=`)
  - Subscript indexing (`[]`) with bounds-checking
  - Stream I/O operators (`cin >>`, `cout <<`)
- **Utility Methods:**
  - `size()`: Returns current string length.
  - `empty()`: Returns `true` if string length is 0.
  - `clear()`: Deallocates buffer and resets to empty string `""`.
  - `c_str()`: Returns raw pointer to null-terminated `const char*` array.

---

## Memory Model & The Rule of Three

### Deep Copy vs. Shallow Copy

When an object containing dynamic pointers is copied naively (shallow copy), both objects point to the same memory address on the heap. When one object goes out of scope, its destructor deletes the memory, leaving the other object with a dangling pointer that triggers a fatal **double-free runtime crash**.

`MyString` implements **Deep Copying**:

```
Stack (Local Variables)            Heap Memory (RAM)
───────────────────────            ───────────────────────────────────────
s1: [ str* | length: 5 ] ───────►  Address 0x100: ['H','e','l','l','o','\0']
                                     ▲ (Mutating s1[0] -> 'X' modifies only 0x100)

s2: [ str* | length: 5 ] ───────►  Address 0x200: ['H','e','l','l','o','\0']
(Deep Copied Instance)               ▲ (Remains 'H' - Complete Pointer Isolation!)
```

---

## Operator Overloading Matrix

| Operator | Syntax | Description | Return Type |
| :--- | :--- | :--- | :--- |
| **Default Constructor** | `MyString s;` | Allocates empty buffer `""` (`\0`) | Instance |
| **Parameterized** | `MyString s("Hello");` | Calculates length & allocates exact heap size | Instance |
| **Copy Constructor** | `MyString copy(s);` | Allocates independent heap array & deep copies | Instance |
| **Destructor** | `~MyString()` | Automatically executes `delete[] str` | `void` |
| **Assignment** | `assign = s;` | Frees existing memory & allocates deep copy | `MyString&` |
| **Concatenation** | `s1 + s2` | Allocates new buffer `(len1 + len2 + 1)` | `MyString` |
| **Equality** | `s1 == s2` | Character-by-character comparison | `bool` |
| **Inequality** | `s1 != s2` | Inverts equality check | `bool` |
| **Index Access** | `s[i]` | Read & write access to `char` with bounds check | `char&` |
| **Stream Extraction** | `cin >> s` | Overwrites buffer from standard input stream | `istream&` |
| **Stream Insertion** | `cout << s` | Outputs string directly to standard output | `ostream&` |

---

## ColorCode Interactive Web Studio

In addition to standard command line execution, this repository features an **Interactive Developer Studio** served via a Python bridge:

* **Real-time Memory Inspector:** Visually tracks Stack pointers and Heap byte allocations in real time.
* **Interactive Operator Workbench:** Type any custom strings into `s1` and `s2` and evaluate operators interactively.
* **Live C++ Code Generator:** Shows the exact C++ source code snippet corresponding to your actions.
* **Native C++ Execution Bridge:** Spawns `MyString.exe` via stdin/stdout IPC to run native compiled C++ logic and stream console logs into an embedded developer terminal.

---

## Project Structure

```text
.
├── Main.cpp          # Driver application demonstrating all class features
├── MyString.h        # Class declaration & public API specification
├── MyString.cpp      # Implementation of methods & overloaded operators
├── MyString.exe      # Compiled Windows 64-bit binary
├── launch_gui.bat    # One-click launcher for the Web Studio & server
├── run.bat           # CLI compilation and execution script
├── server.py         # Local Python HTTP server & C++ native bridge
├── frontend/         # Web Studio UI assets
│   ├── index.html    # Clean, modern single-page studio layout
│   ├── style.css     # Bespoke CSS design system with dark mode aesthetics
│   ├── app.js        # Dynamic UI logic, memory visualizer & IPC client
│   └── assets/       # Visual imagery & icons
└── README.md         # Comprehensive project documentation
```

---

## How to Run

### Option 1: Interactive GUI Studio (Recommended)

1. Double-click **`launch_gui.bat`**, or run from PowerShell / Command Prompt:
   ```powershell
   .\launch_gui.bat
   ```
2. Or start the server directly using Python:
   ```bash
   python server.py --open
   ```
3. Open your browser at **[http://127.0.0.1:5050](http://127.0.0.1:5050)** to explore the workbench and memory inspector.

> **Note for PowerShell Users:** Always prefix batch files with `.\` (e.g. `.\launch_gui.bat`) rather than running `launch_gui.bat` directly.

---

### Option 2: Command Line (CLI) Batch Script

On Windows, run the automated compile-and-run script:
```powershell
.\run.bat
```

---

### Option 3: Manual Compilation & Execution

#### Windows (MinGW / GCC)
```powershell
g++ -Wall -Wextra Main.cpp MyString.cpp -o MyString.exe
.\MyString.exe
```

#### Linux & macOS (GCC / Clang)
```bash
g++ -Wall -Wextra Main.cpp MyString.cpp -o MyString
./MyString
```

---

## Sample Execution Output

```text
========== MyString Class Demonstration ==========

Enter first string : Hello
Enter second string: World

----- Input Strings -----
s1 = Hello
s2 = World

----- Concatenation -----
s1 + s2 = HelloWorld

----- Comparison -----
s1 and s2 are not equal.
operator!= confirms: s1 and s2 are not equal.

----- Copy Constructor -----
Original : Hello
Copied   : Hello

Changing first character of original string...
Original after modification : Xello
Copied remains             : Hello

Deep copy verified.

----- Assignment Operator -----
Assigned string = World

----- Index Operator -----
First character : W
Modified string : Zorld

----- Utility Functions -----
Length of s1 : 5
Length of s2 : 5
s1 is not empty.

----- Clear Function -----
After clear(), s2 = ""
Length = 0
s2 is now empty.

----- c_str() Function -----
Character array of s1 : Xello

========== Program Finished Successfully ==========
```

---

## Automated Test Suite

The project includes an 8-point automated test matrix:

1. **Default Constructor Test:** Empty string allocation with length `0` and null terminator `\0`.
2. **Parameterized Constructor Test:** Accurate length calculation and string storage.
3. **Copy Constructor (Deep Copy) Test:** Independent heap buffers verifying pointer isolation.
4. **Concatenation (`+`) Test:** Correct multi-string merge and buffer sizing.
5. **Comparison (`==` / `!=`) Test:** Accurate lexicographical equivalence testing.
6. **Subscript (`[]`) Read & Write Test:** In-place character mutation and bounds verification.
7. **`clear()` & `empty()` Method Test:** Complete deallocation and state reset.
8. **Null Terminator Integrity Test:** Confirms standard C-string compatibility (`c_str()`).

---

## OOP Concepts Demonstrated

* **Encapsulation:** Internal pointer `char* str` and `length` are protected as `private` members.
* **Dynamic Memory Management:** Raw pointer manipulation via heap allocation (`new[]` / `delete[]`).
* **The Rule of Three:** Integrated destructor, copy constructor, and copy assignment operator.
* **Operator Overloading:** Both member operators (`+`, `==`, `[]`, `=`) and non-member friend operators (`<<`, `>>`).
* **Exception Handling:** Standard exception `std::out_of_range` thrown on index boundary violations.
* **Const Correctness:** Read-only member functions and const reference parameters throughout.

---

## Author & Acknowledgements

Submitted as an advanced **Object-Oriented Programming (OOP) in C++** course project.
