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

	temp = getenv("QUERY_STRING"); //pour récupérer le contenu des paramètres GET

	GetCursorPos(&pt); //récupération position curseur souris

	std::string str = temp; 
	//std::string str = "x=300&y=10";
	std::vector<std::string> tmp = split(str, '&'); //format d'entrée de la chaine x=XXX&y=YYY ou XXX et YYY les coordonnées
	char* x, *y;
	x = const_cast<char*>(tmp[0].c_str()); //récupération chaine de l'abscisse
	y = const_cast<char*>(tmp[1].c_str()); //récupération chaine de l'ordonnée
	x += 2; //déplacement du pointeur pour ignorer "x="
	y += 2; //déplacement du pointeur pour ignorer "y="
	pt.x = atoi(x); //conversion en entier
	pt.y = atoi(y); //conversion en entier
	SetCursorPos(pt.x, pt.y); //déplacement du curseur

	mouse_event(dwEventFlags, pt.x, pt.y, dwData, 0); //exécution de la manipulation souris

	printf("Content-Type: text/html;\n\n");
	printf("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"fr\" >\n\t<head>");
	printf("\t\t<title>Retour action balayage</title>");
	printf("\t\t<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n\t</head>\n\t<body>");
	printf("<p>le deplacement + clic effectues en (%ld, %ld)</p>", pt.x, pt.y);
	printf("\t</body>\n</html>");
	
	return EXIT_SUCCESS;
}

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

