#ifndef MYSTRING_H
#define MYSTRING_H

#include <iostream>

class MyString
{
private:
    char* str;
    int length;

    static int stringLength(const char* s);
    static void copyString(char* dest, const char* src);
    static int compareString(const char* s1, const char* s2);

public:
    MyString();
    MyString(const char* s);
    MyString(const MyString& other);
    ~MyString();

    MyString& operator=(const MyString& other);

    MyString operator+(const MyString& other) const;
    bool operator==(const MyString& other) const;
    bool operator!=(const MyString& other) const;

    char& operator[](int index);
    const char& operator[](int index) const;

    int size() const;
    bool empty() const;
    void clear();
    const char* c_str() const;

    friend std::ostream& operator<<(std::ostream& out, const MyString& s);
    friend std::istream& operator>>(std::istream& in, MyString& s);
};

#endif