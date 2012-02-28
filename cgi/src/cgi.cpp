//============================================================================
// Name        : cgi.cpp
// Author      : 
// Version     :
// Copyright   : Your copyright notice
// Description : Hello World in C++, Ansi-style
//============================================================================

#include <windows.h>

#include <iostream>
#include <cstdio>

#include <string>
#include <sstream>
#include <algorithm>
#include <iterator>
#include <vector>

using namespace std;

void haut(char *title);

void bas();

//std::vector<std::string> split(const std::string str);

std::vector<std::string> &split(const std::string &s, char delim, std::vector<std::string> &elems);

std::vector<std::string> split(const std::string &s, char delim);

int main() {
	POINT pt;
	DWORD dwEventFlags;
	DWORD dwData;
	char *temp;

	dwData = 0;
	dwEventFlags = MOUSEEVENTF_ABSOLUTE;
	dwEventFlags |= MOUSEEVENTF_LEFTDOWN;
	dwEventFlags |= MOUSEEVENTF_LEFTUP;

	temp = getenv("QUERY_STRING");

	GetCursorPos(&pt);
	//pt.x = 1190;
	//pt.y = 5;

	std::string str = temp;
	//std::string str = "x=300&y=10";
	std::vector<std::string> tmp = split(str, '&');
	char* x, *y;
	x = const_cast<char*>(tmp[0].c_str());
	y = const_cast<char*>(tmp[1].c_str());
	x += 2;
	y += 2;
	pt.x = atoi(x);
	pt.y = atoi(y);
	SetCursorPos(pt.x, pt.y);

	mouse_event(dwEventFlags, pt.x, pt.y, dwData, 0);

	printf("Content-Type: text/html;\n\n");
	printf(
			"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\" >\n\t<head>");
	printf("\t\t<title>(%ld, %ld)</title>", pt.x, pt.y);
	printf(
			"\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n\t</head>\n\t<body>");

	printf("\t</body>\n</html>");


	/*
	 printf("Content-Type: text/html;\n\n");
	 haut(temp);
	 printf("Hello World !");
	 bas();
	 //*/
	return EXIT_SUCCESS;
}

void haut(char *title) {
	printf(
			"<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\" >\n\t<head>");
	printf("\t\t<title>%s</title>", title);
	printf(
			"\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n\t</head>\n\t<body>");
}

void bas() {
	printf("\t</body>\n</html>");
}

/*std::vector<std::string> split(const std::string str)
{
	std::istringstream iss(str);
	std::vector<string> tokens;
	std::copy(istream_iterator<string>(iss),
	         istream_iterator<std::string>(),
	         back_inserter<std::vector<std::string> >(tokens));

	return tokens;
}*/

std::vector<std::string> &split(const std::string &s, char delim, std::vector<std::string> &elems) {
    std::stringstream ss(s);
    std::string item;
    while(std::getline(ss, item, delim)) {
        elems.push_back(item);
    }
    return elems;
}


std::vector<std::string> split(const std::string &s, char delim) {
    std::vector<std::string> elems;
    return split(s, delim, elems);
}

