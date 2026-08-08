#ifndef MYSTRING_H
#define MYSTRING_H

#include <iostream>

using namespace std;

class MyString
{
private:
    char* str;
    int length;

    int stringLength(const char* s) const;
    void copyString(char* dest, const char* src) const;
    int compareString(const char* s1, const char* s2) const;

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

    friend ostream& operator<<(ostream& out, const MyString& s);
    friend istream& operator>>(istream& in, MyString& s);
};

#endif