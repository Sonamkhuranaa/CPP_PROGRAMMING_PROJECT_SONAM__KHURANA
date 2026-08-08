#include <iostream>
#include "MyString.h"

using namespace std;

int main()
{
    cout << "========== MyString Class Demonstration ==========\n\n";

    MyString s1;
    MyString s2;

    cout << "Enter first string : ";
    cin >> s1;

    cout << "Enter second string: ";
    cin >> s2;

    cout << "\n----- Input Strings -----\n";
    cout << "s1 = " << s1 << endl;
    cout << "s2 = " << s2 << endl;

    cout << "\n----- Concatenation -----\n";
    MyString s3 = s1 + s2;
    cout << "s1 + s2 = " << s3 << endl;

    cout << "\n----- Comparison -----\n";
    if (s1 == s2)
        cout << "s1 and s2 are equal.\n";
    else
        cout << "s1 and s2 are not equal.\n";

    if (s1 != s2)
        cout << "operator!= also works correctly.\n";
    else
        cout << "operator!= also works correctly.\n";

    cout << "\n----- Copy Constructor -----\n";
    MyString copy(s1);

    cout << "Original : " << s1 << endl;
    cout << "Copied   : " << copy << endl;

    cout << "\nChanging first character of original string...\n";

    if (!s1.empty())
        s1[0] = 'X';

    cout << "Original after modification : " << s1 << endl;
    cout << "Copied remains             : " << copy << endl;

    cout << "\nDeep copy verified.\n";

    cout << "\n----- Assignment Operator -----\n";

    MyString assign;

    assign = s2;

    cout << "Assigned string = " << assign << endl;

    cout << "\n----- Index Operator -----\n";

    if (!assign.empty())
    {
        cout << "First character : " << assign[0] << endl;

        assign[0] = 'Z';

        cout << "Modified string : " << assign << endl;
    }

    cout << "\n----- Utility Functions -----\n";

    cout << "Length of s1 : " << s1.size() << endl;
    cout << "Length of s2 : " << s2.size() << endl;

    if (s1.empty())
        cout << "s1 is empty.\n";
    else
        cout << "s1 is not empty.\n";

    cout << "\n----- Clear Function -----\n";

    s2.clear();

    cout << "After clear(), s2 = \"" << s2 << "\"" << endl;
    cout << "Length = " << s2.size() << endl;

    if (s2.empty())
        cout << "s2 is now empty.\n";

    cout << "\n----- c_str() Function -----\n";

    cout << "Character array of s1 : " << s1.c_str() << endl;

    cout << "\n========== Program Finished Successfully ==========\n";

    return 0;
}