# MyString Class in C++

## Overview
This project implements a custom `MyString` class in C++ using Object-Oriented Programming concepts. It demonstrates dynamic memory allocation, deep copying, operator overloading, constructors, destructors, and string manipulation without using the C++ `std::string` class internally.

## Features
- Dynamic memory management using `new` and `delete`
- Default constructor
- Parameterized constructor
- Copy constructor
- Destructor
- Assignment operator
- String concatenation (`+`)
- Equality (`==`) and inequality (`!=`) operators
- Index operator (`[]`)
- Input (`>>`) and output (`<<`) operator overloading
- Utility functions:
  - `size()`
  - `empty()`
  - `clear()`
  - `c_str()`

## Project Structure

```
.
├── Main.cpp        # Driver program
├── MyString.h      # Class declaration
├── MyString.cpp    # Class implementation
└── README.md
```

## How to Compile

Using g++:

```bash
g++ Main.cpp MyString.cpp -o MyString
```

## How to Run

Windows:

```bash
MyString.exe
```

Linux/macOS:

```bash
./MyString
```

## Sample Input

```
Hello
World
```

## Sample Output

```
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

...

========== Program Finished Successfully ==========
```

## Concepts Demonstrated

- Object-Oriented Programming (OOP)
- Dynamic Memory Allocation
- Deep Copy
- Copy Constructor
- Destructor
- Operator Overloading
- Encapsulation
- Function Overloading

## Author

Submitted as a C++ Object-Oriented Programming course project.
