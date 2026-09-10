#include "MyString.h"
#include <iomanip>
#include <stdexcept>

using namespace std;

int MyString::stringLength(const char* s)
{
    if (s == nullptr)
        return 0;

    int len = 0;
    while (s[len] != '\0')
        len++;

    return len;
}

void MyString::copyString(char* dest, const char* src)
{
    if (dest == nullptr || src == nullptr)
        return;

    int i = 0;
    while (src[i] != '\0')
    {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
}

int MyString::compareString(const char* s1, const char* s2)
{
    if (s1 == nullptr && s2 == nullptr)
        return 0;
    if (s1 == nullptr)
        return -1;
    if (s2 == nullptr)
        return 1;

    int i = 0;
    while (s1[i] != '\0' && s2[i] != '\0')
    {
        if (s1[i] != s2[i])
            return static_cast<unsigned char>(s1[i]) - static_cast<unsigned char>(s2[i]);
        i++;
    }

    return static_cast<unsigned char>(s1[i]) - static_cast<unsigned char>(s2[i]);
}

MyString::MyString()
{
    length = 0;
    str = new char[1];
    str[0] = '\0';
}

MyString::MyString(const char* s)
{
    if (s == nullptr)
    {
        length = 0;
        str = new char[1];
        str[0] = '\0';
    }
    else
    {
        length = stringLength(s);
        str = new char[length + 1];
        copyString(str, s);
    }
}

MyString::MyString(const MyString& other)
{
    length = other.length;
    str = new char[length + 1];
    copyString(str, other.str);
}

MyString::~MyString()
{
    delete[] str;
}

MyString& MyString::operator=(const MyString& other)
{
    if (this != &other)
    {
        char* newStr = new char[other.length + 1];
        copyString(newStr, other.str);

        delete[] str;
        str = newStr;
        length = other.length;
    }

    return *this;
}

MyString MyString::operator+(const MyString& other) const
{
    MyString temp;
    delete[] temp.str;

    temp.length = length + other.length;
    temp.str = new char[temp.length + 1];

    int i = 0;
    for (int j = 0; j < length; j++)
        temp.str[i++] = str[j];

    for (int j = 0; j < other.length; j++)
        temp.str[i++] = other.str[j];

    temp.str[i] = '\0';

    return temp;
}

bool MyString::operator==(const MyString& other) const
{
    return compareString(str, other.str) == 0;
}

bool MyString::operator!=(const MyString& other) const
{
    return !(*this == other);
}

char& MyString::operator[](int index)
{
    if (index < 0 || index >= length)
        throw out_of_range("Index out of range");

    return str[index];
}

const char& MyString::operator[](int index) const
{
    if (index < 0 || index >= length)
        throw out_of_range("Index out of range");

    return str[index];
}

int MyString::size() const
{
    return length;
}

bool MyString::empty() const
{
    return length == 0;
}

void MyString::clear()
{
    delete[] str;
    length = 0;
    str = new char[1];
    str[0] = '\0';
}

const char* MyString::c_str() const
{
    return str;
}

ostream& operator<<(ostream& out, const MyString& s)
{
    out << (s.str ? s.str : "");
    return out;
}

istream& operator>>(istream& in, MyString& s)
{
    char buffer[1000];

    if (in >> setw(sizeof(buffer)) >> buffer)
    {
        delete[] s.str;
        s.length = MyString::stringLength(buffer);
        s.str = new char[s.length + 1];
        MyString::copyString(s.str, buffer);
    }

    return in;
}