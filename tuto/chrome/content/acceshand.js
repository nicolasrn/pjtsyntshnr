/**
 *Classe permettant d'avoir accès a certaines donées tel que les propriétés d'un objet
 *ou l'accès au contenu web
 */
function Utils()
{
}

Utils.prototype.getMainWindow = function()
{
	return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                  .getInterface(Components.interfaces.nsIWebNavigation)
                  .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                  .rootTreeItem
                  .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                  .getInterface(Components.interfaces.nsIDOMWindow);
}

Utils.prototype.getKeys = function(obj)
{
	var keys = [];
	for(let key in obj){
		keys.push(key);
	}
	return keys;
}

Utils.getMainWindow = function()
{
	return window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                  .getInterface(Components.interfaces.nsIWebNavigation)
                  .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                  .rootTreeItem
                  .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                  .getInterface(Components.interfaces.nsIDOMWindow);
}

Utils.prototype.getValuesOfKeys = function(obj)
{
	var keys = [];
	for(let key in obj){
		keys.push(key + " : " + obj[key]);
	}
	return keys;
}

Utils.getKeys = function(obj)
{
	var keys = [];
	for(let key in obj){
		keys.push(key);
	}
	return keys;
}

Utils.getValuesOfKeys = function(obj)
{
	var keys = [];
	for(let key in obj){
		keys.push(key + " : " + obj[key]);
	}
	return keys;
}

mutils = new Utils();

Timer = function()
{
	this.idTimer = null;
	this.urlPagePred = null;
	this.tabId = new Array();
	
	this.stop = function()
	{
		//for(let i = 0; i < this.tabId.length; i++)
		//	clearInterval(this.tabId[i]);
		clearTimeout(this.idTimer);
	}
	
	this.start = function()
	{
		this.parcours(this);
	}
	
	this.parcours = function(self)
	{
		//alert("self.urlPagePred : " + self.urlPagePred + "\n" + "location.href : " + mutils.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href);
		//alert("timer : " + this.idTimer);
		
		if (self.urlPagePred != mutils.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href)
		{
			self.urlPagePred = mutils.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href;
			Command.retour();
			self.stop();
		}
		else
			self.idTimer = setTimeout(self.parcours, 5000, self);
	}
}

timer = new Timer();


/*var fctEcrire = function(event)
{
	event.dispatchEvent(event);
}*/

function debug(str)
{
	document.getElementById('debug').value = str + "\n" + document.getElementById('debug').value;
}

function pausecomp(ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
}

/**
 *Classe ou tableau associatif regroupant les différentes commandes boutons
 */
Command = {
	utils: mutils,
	
	tailleBouton: 50,
	
	timerNavigation: false,
	
	buttonPressed: function () 
	{
		pausecomp(1000);
		let retStop = clavierCourant.stop();
		//setTimeout(function() {
			let retExec = clavierCourant.execute();
			//debug("dans le clique : stop = " + retStop);
			//debug("dans le clique : exec = " + retExec);
			//alert("execute ? " + ret);
			clavierCourant.start(retStop);
		//}, 1000); //temporisation necessaire apparement pour le click*/
	},
	
	//fonction clavierPrincipal
	onglet: function()
	{
		clavierPrec = clavierCourant;
		clavierCourant = clavierOnglet;
		clavierCourant.display();
		//clavierCourant.parcourir();
	},
	
	page: function()
	{
		clavierPrec = clavierCourant;
		clavierCourant = clavierPage;
		clavierCourant.display();
		//clavierCourant.parcourir();
	},
	
	numerique: function()
	{
		clavierPrec = clavierCourant;
		clavierCourant = clavierNumerique;
		clavierCourant.display();
		//clavierCourant.parcourir();
	},
	
	alpha: function()
	{
		clavierPrec = clavierCourant;
		clavierCourant = clavierAlpha;
		clavierCourant.display();
	},
	
	favoris: function()
	{
		clavierPrec = clavierCourant;
		clavierCourant = clavierFavori;
		clavierCourant.display();
		//clavierCourant.parcourir();
	},
	
	navigation: function()
	{
		urll = this.utils.getMainWindow().liberator.modules.buffer.URL;
		//let map = this.utils.getMainWindow().liberator.modules.mappings["get"](1, "f", urll);
		//map.execute(null, null);
		this.utils.getMainWindow().liberator.modules.hints.show('o', undefined, undefined, true, true);
		this.numerique();
		//timer.urlPagePred = this.utils.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href;
		//if (this.timerNavigation == false)
		//{
		//	this.timerNavigation = true;
		//	timer.start();
		//}
	},
	
	souris: function()
	{
		$.ajax({
			   type: "GET",
			   url: "localhost",
			   data: "x=200&y=200",
			   success: function(msg){
			     alert( "nickel" );
			   },
			   error: function()
			   {
				   alert("pepin");
			   }
			 });
	},
	
	retour: function()
	{
		if (clavierPrec != null && !(clavierCourant == clavierPrincipal))
		{
			clavierCourant.hidden();
			clavierCourant = clavierPrec;
			//clavierCourant.display();
			//clavierCourant.parcourir();
		}
		if (this.timerNavigation)
		{
			clavierCourant.start();
			this.timerNavigation = false;
		}
	},
	
	//fonction ClavierNumerique
	numero: function(nb)
	{
		let evt = document.createEvent("Events");
	    evt.initEvent("keypress", true, true);
		
	    evt.view = window;
	    evt.altKey = false;
	    evt.ctrlKey = false;
	    evt.shiftKey = false;
	    evt.metaKey = false;
	    evt.keyCode = "" + nb;
	    evt.charCode = ("" + nb).charCodeAt(0);
	    
		this.utils.getMainWindow().liberator.modules.hints.onEvent(evt);
		
		let elem = this.utils.getMainWindow().liberator.modules.buffer.lastInputField;
	    elem.focus();
	},
	
	//fonction ClavierAlpha
	caractere: function(char)
	{
		let target = this.utils.getMainWindow().liberator.modules.buffer.lastInputField;
		target.focus();
		let key = target.ownerDocument.createEvent("KeyEvents");
		key.initKeyEvent("keypress", true, true, null, false, false, false, false, 0, char.charCodeAt(0));
		//key.initKeyEvent("keypress", true, true, null, false, false, false, false, /*ici pour les caracteres speciaux*/, 0);
		target.dispatchEvent(key);
		key.stopPropagation;
	},
	
	//fonction clavierPage
	//monter dans la page
	up: function()
	{
		//this.utils.getMainWindow().liberator.modules.buffer.scrollLines(-5);
		//document.getElementById('debug').value=this.utils.getKeys(this.utils.getMainWindow().getBrowser().selectedBrowser.contentWindow).join('\n');
		this.utils.getMainWindow().getBrowser().selectedBrowser.contentWindow.scrollByPages(-1);
		//alert("la");
	},
	
	//descendre dans la page
	down: function()
	{
		//this.utils.getMainWindow().liberator.modules.buffer.scrollLines(5);
		this.utils.getMainWindow().getBrowser().selectedBrowser.contentWindow.scrollByPages(1);
		//alert("la");
	},
	
	left: function()
	{
		this.utils.getMainWindow().gBrowser.goBack();
	},
	
	right: function()
	{
		this.utils.getMainWindow().gBrowser.goForward();
	},
	
	//fonction ClavierOnglet
	ongletLeft : function()
	{
		//selectTabAtIndex( index, event )
	    document.getElementById('debug').value=this.utils.getKeys(this.utils.getMainWindow().getBrowser()).join('\n');
		this.utils.getMainWindow().gBrowser.tabContainer.advanceSelectedTab(-1, true);
	},
	
	ongletRight: function()
	{
		this.utils.getMainWindow().gBrowser.tabContainer.advanceSelectedTab(1, true);
	},
	
	ongletClose: function()
	{
		this.utils.getMainWindow().gBrowser.removeCurrentTab();
	},
	
	ongletAdd: function()
	{
		// Add tab    
		this.utils.getMainWindow().gBrowser.addTab("http://www.google.com/");  
		//gBrowser.selectedTab = gBrowser.addTab("http://www.google.com/"); 
	},

	naviguer: function(url)
	{
		//accede a l'url entree en parametre	
		this.utils.getMainWindow().gBrowser.addTab(url); 
	},
	
	recupFavoris: function()
	{
		let bookmarks = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		let history = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
		
		let query = history.getNewQuery();
		
		//Specify folders to be searched
		let folders = [bookmarks.toolbarFolder, bookmarks.bookmarksMenuFolder, bookmarks.unfiledBookmarksFolder];
		query.setFolders(folders, folders.length);
		
		//Specify terms to search for, matches against title, URL and tags
		//query.searchTerms = "firefox";
		
		let options = history.getNewQueryOptions();
		options.queryType = options.QUERY_TYPE_BOOKMARKS;
		
		let result = history.executeQuery(query, options);
		
		//The root property of a query result is an object representing the folder you specified above.
		let resultContainerNode = result.root;
		
		//Open the folder, and iterate over its contents.
		resultContainerNode.containerOpen = true;
		
		let nom = new Array();
		let action = new Array();
		for (let i=0; i < resultContainerNode.childCount; ++i) 
		{
			let childNode = resultContainerNode.getChild(i);
			
			// Accessing properties of matching bookmarks
			let title = childNode.title;
			let uri = childNode.uri;
			
			action.push("Command.naviguer(\""+uri+"\")");
			if (title == "")
				title = uri.substr(10, 100);
			
			title = title.length > Command.tailleBouton ? title.substr(0, Command.tailleBouton - 3) + "…" : title;
			nom.push(title);
		}
		return [nom, action];
	},

	deleteFavori: function()
	{
		/*
		 * With the bookmarks service:
		 * removeItem(aItemId) - Works for all types
		 * removeFolder(aItemId) - Works for folders and livemarks
		 * removeFolderChildren(aItemId) - Works for folders and livemarks
		 */
		let bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		let ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		let uri = ios.newURI(this.utils.getMainWindow().liberator.modules.buffer.URL, null, null);
		let bookmarksArray = bmsvc.getBookmarkIdsForURI(uri, {});
		
		for(let i = 0; i < bookmarksArray.length; i++)
			bmsvc.removeItem(bookmarksArray[i]);
	},
	
	addFavori: function()
	{
		let bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		let ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		let uri = ios.newURI(this.utils.getMainWindow().liberator.modules.buffer.URL, null, null);
		let title = this.utils.getMainWindow().window.document.title.replace("- Vimperator", "").replace("Vimperator", "");
		
		title = title.length > Command.tailleBouton ? title.substr(0, Command.tailleBouton - 3) + "…" : title;
		let newBkmkId = bmsvc.insertBookmark(bmsvc.bookmarksMenuFolder, uri, bmsvc.DEFAULT_INDEX, title);
		//uri = getBookmarkURI(id)
		//alert("la");
		//let bookmarksArray = bmsvc.getBookmarkIdsForURI(uri, {});
		//alert("ici");
		//alert(bookmarksArray);
		//alert("ok");
		
		/*
		 * sofiane
		 */
		/*url = this.utils.getMainWindow().liberator.modules.buffer.URL;
		var indiceDepart = url.indexOf('.')+1;
		var nomPage = url.substring(indiceDepart);		
		var indiceFin = nomPage.indexOf('.'); 
		nomPage = nomPage.substring(0,indiceFin);
		//ecriture de l'information dans le fichier texte adequate de la forme nom;url sur chaque ligne
		var file = Components.classes["@mozilla.org/file/directory_service;1"]
                    .getService(Components.interfaces.nsIProperties)
                    .get("TmpD", Components.interfaces.nsIFile);
		file.append("favoris.txt");
		if (!file.exists())
			file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);		 
		// file est un nsIFile, data est une chaîne de caractères
		var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
								.createInstance(Components.interfaces.nsIFileOutputStream);
		// utiliser 0x02 | 0x10 pour ouvrir le fichier en ajout.
		foStream.init(file,0x02|0x10, 0664, 0); // écrire, créer, tronquer
		foStream.write(nomPage+";", nomPage.length+1);		
		foStream.write(url, url.length);
		foStream.close();*/
	}
}

/**
 *Classe permettant la gestion d'un clavier
 *@param keys : liste des touches sous forme de tableau de caractere
 *@param actionKeys : liste des actions associées au bouton sous forme tableau de chaine de caractère attention actionKeys[i] est associé à keys[i]
 *@param nomVar : nom de la variable utilisé pour faire la récursion avec setTimeOut
 */
function ClavierVirtuel(keys, actionKeys, nc, nr)
{
	//liste des touches sous formes de tableaux de caractère ou chaine
	this.keyTab = keys;
	//liste des actions associées aux boutons 
	this.actKeys = actionKeys;
	//tableau qui contient les boutons en tant qu'objet XUL
	this.buttonTab = null;// = new Array();
	//pour le balayage
	this.iterateur = 0; //1 dimension
	this.iterateurX = 0;//2 dimensions
	this.iterateurY = 0;//2 dimensions
	this.continuer = true;
	//pour l'appel récursif
	//this.varName = nomVar;
	
	this.selectedButton = 0;
	
	//pour l'affichage
	if (!nr)	this.nbRow = this.keyTab.length; 
	else 		this.nbRow = nr;
	
	if (!nc) 	this.nbCol = 1; 
	else		this.nbCol = nc;
	
	//alert(this.keyTab + "\n" + this.nbRow + " " + this.nbCol);
	
	this.timer = null;
	
	this.created = false;
	this.cntPrincipal = null;
	
	//fonction qui permet d'ajouter un bouton au clavier
	this.addKey = function(aLabel, command)
	{
		// crée un nouvel élément de menu XUL
		let item = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "button"); 
		item.setAttribute("label", aLabel);
		item.setAttribute("oncommand", command);
		return item;
	}
	
	this.buttonTab = new Array(this.nbCol);
	for(let i = 0; i < this.nbCol; i++)
		this.buttonTab[i] = new Array(this.nbRow);
	//initialisation du tableau de bouton
	for(let k = 0; k < this.nbCol; k++)
	{
		for(let j = 0; j < this.nbRow; j++)
		{
			let boutton = this.addKey("" + this.keyTab[this.iterateur], (Array.isArray(this.actKeys) ? this.actKeys[this.iterateur] : this.actKeys));
			this.buttonTab[k][j] = boutton;
			this.iterateur++;
		}
	}
	this.iterateur = 0;
	//alert(this.buttonTab.join("\n"));
	
	//rajoute un hbox avec un id aId et un booleen indiquant la visibilité : visible = true
	this.addHBox = function(aId, visible)
	{
		// crée un nouvel élément de menu XUL
		let item = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "hbox"); 
		item.setAttribute("id", aId);
		item.setAttribute("hidden", !visible);
		return item;
	}
	
	//rajoute un vbox avec un id aId et un booleen indiquant la visibilité : visible = true
	this.addVBox = function(aId, visible)
	{
		// crée un nouvel élément de menu XUL
		let item = document.createElementNS("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "vbox"); 
		item.setAttribute("id", aId);
		item.setAttribute("hidden", !visible);
		return item;
	}
	
	//creation du clavier
	//fonctionne comme un singleton
	this.createKeyBoard = function(idParent)
	{
		if (this.created == false)//si rien n'a encore ete fait
		{
			this.iterateur = 0;//variable de travail
			let box = document.getElementById(idParent); //contenaire parent
			this.cntPrincipal = this.addVBox("filsDe"+idParent, false); //contenaire principale 
			let ok = true; //permet de verifier si on a encore un bouton dispo
			
			//alert("this.nbCol : " + this.nbCol + "\nthis.nbRow : " + this.nbRow);
			for (let i = 0; !(i >= this.nbCol || ok == false); i++) //tant que i < this.nbCol && ok == false
			{
				let line = this.addHBox("c"+i, true); //pour mise en forme
				for(let j = 0; !(j >= this.nbRow || ok == false); j++) // sur chaque ligne
				{
					//alert(this.actKeys[this.iterateur]);
					if (!this.actKeys[this.iterateur]) //condition qui permet de verifier si un bouton existe encore
					{
					//	alert("erreur");
						ok = false; //dans ce cas non pour indiquer qu'on va sortir du let i …
						break; //on sort de la boucle courante et donc on remonte dans le let i ...
					}
					//alert("insertion en (" + i + ", " + j + ")\niterateur = " + this.iterateur + "\nbouton : " + this.keyTab[this.iterateur]);
					line.appendChild(this.buttonTab[i][j]);//ajout dans la ligne
					this.iterateur++; //on increment 
				}
				this.cntPrincipal.appendChild(line); //on rajoute la ligne au contenaire principale
			}
			box.appendChild(this.cntPrincipal);//le containaire principale et rajoute au parent
			this.created = true; //la creation est termine
			this.iterateur = 0; // reinitialisation de la variable de travail
		}
	}
	
	//execute l'action associé au bouton i
	this.execute = function()
	{
		if (this.continuer ==  false)
		{
			/*if (this.nbCol == 1)
			{
				this.iterateur = 1;
				this.iterateurY++;
			}
			alert("this.buttonTab[" + this.iterateurY + "- 1][" + this.iterateurX + "- 1]");*/
			
			//debug("Execution : iterateur = " + this.iterateur);
			//il suffit de simuler un clique
			if (this.iterateur == 1) // si j'ai fait les 2 iterations
			{
			//	debug("Execution dans le if : iterateur = " + this.iterateur);
			//	if (this.buttonTab[this.selectedButton]) //si le bouton existe
			//	{
			//		//alert("boutton selectionné" + this.selectedButton);
					//alert("avant exec");
					this.buttonTab[this.iterateurY - 1][this.iterateurX - 1].click(); //action du bouton
					//alert("apres exec");
					this.iterateur = 0;
			//		debug("Execution dans le if if apres execution : iterateur = " + this.iterateur);
					return true; //actionne
			//	}
			}
			this.iterateur = 1;
			//debug("Execution : nouvel iterateur = " + this.iterateur);
			return false;
		}
		return false;
	}
	
	//affiche le clavier mis en forme avec hbox et vbox selon le nbRow et nbCol
	this.display = function()
	{
		//document.getElementById('debug').value = getKeys(buttonTab[0]).join("\n");
		this.cntPrincipal.setAttribute("hidden", "false");
	}
	
	//masque le clavier
	this.hidden = function()
	{
		this.cntPrincipal.setAttribute("hidden", "true");
		this.stop();
	}
	
	//retourne l'identifiant dans le tableau de bouton du bouton selectionné 
	//retourne un entier pas un bouton
	this.getSelectedButton = function()
	{
		//alert("" + this.selectedButton);
		return this.selectedButton;
	}
	
	//stop le timer
	this.stop = function()
	{
		//alert("dans stop");
		this.continuer = false;
		clearTimeout(this.timer);
		//alert("1");
		//this.selectedButton = (this.iterateurX - 1) * this.nbCol + this.iterateurY - 1;//this.iterateur - 1; //comme on incremente juste avant de l'appel récursif
		//alert(this.selectedButton);
		//alert("2");
		//for(let i = 0; i < this.buttonTab.length; i++)
		//	this.buttonTab[i].setAttribute("style", "color:black");
		//alert("3");

		if (this.nbCol == 1)
		{
			this.iterateur = 1;
			this.iterateurY++;
		}
		return this.iterateur == 1 ? true : false;
	}
	
	this.start = function(val)
	{
		if (val)
		{
			for(let i = 0; i < this.nbCol; i++)
				for(let j = 0; j < this.nbRow; j++)
					this.buttonTab[i][j].setAttribute("style", "color:black");
			this.iterateur = 0;
			this.iterateurX = 0;//2 dimensions
			this.iterateurY = 0;//2 dimensions
			//debug("raz iterateur = " + this.iterateur + " iterateurX = " + this.iterateurX + " iterateurY = " + this.iterateurY);
		}
		//debug("reprise avec iterateur = " + this.iterateur + " iterateurX = " + this.iterateurX + " iterateurY = " + this.iterateurY);
		this.continuer = true;
		//alert("av parcours");
		this.parcourir(this);
	}
	
	this.parcourir = function(self)
	{
		if (self.continuer)
		{
			//debug("self.continuer");
			
			if (self.iterateur == 0) //on est sur les x colonne
			{
				//debug("self.iterateur == 0");
				
				//debug("raz compteur");
				if (self.iterateurX > self.nbRow - 1)
					self.iterateurX = 0;
				
				//debug("changement precedant");
				if (self.iterateurX - 1 >= 0) //cas ou un précedant existe
					for(let i = 0; i < self.nbCol; i++)
						self.buttonTab[i][self.iterateurX - 1].setAttribute("style", "color:black");
				else //cas ou le precedant est le dernier elt
					for(let i = 0; i < self.nbCol; i++)
						self.buttonTab[i][self.nbRow - 1].setAttribute("style", "color:black");
					
				//debug("changement courant");
				for(let i = 0; i < self.nbCol; i++)
					self.buttonTab[i][self.iterateurX].setAttribute("style", "color:red");
				
				self.iterateurX++;
				//debug("incrementation x");
			}
			else if (self.iterateur == 1) //on est sur les y ligne
			{
				//debug("self.iterateur == 1");
				
				//debug("raz compteur");
				if (self.iterateurY > self.nbCol - 1)
					self.iterateurY = 0;
				
				//debug("changement precedant");
				if (self.iterateurY - 1 >= 0) //cas ou un précedant existe
					self.buttonTab[self.iterateurY - 1][self.iterateurX - 1].setAttribute("style", "color:red");
				else //cas ou le precedant est le dernier elt
					self.buttonTab[self.nbCol - 1][self.iterateurX - 1].setAttribute("style", "color:red");
				
				//debug("changement courant");
				self.buttonTab[self.iterateurY][self.iterateurX - 1].setAttribute("style", "color:blue");
				
				self.iterateurY++;
				//debug("incrementation y");
			}
			
			clearTimeout(self.timer);
			self.timer = setTimeout(self.parcourir, 1000, self);
		}
	}
}

clavierCourant = null;
clavierPrec = null;

nomClavierPrincipal = new Array(	"onglet", 			"page", 		 "clavier", 			"favoris", 			 "lien", 				"Souris" ,"retour");
actionClavierPrincipal = new Array("Command.onglet()", "Command.page()", "Command.alpha()", "Command.favoris()", "Command.navigation()", "Command.souris()", "Command.retour()");
clavierPrincipal = new ClavierVirtuel(nomClavierPrincipal, actionClavierPrincipal);

nomClavierPage = new Array("monter", "descendre", "précédent", "suivant", "retour");
actionClavierPage = new Array("Command.up()", "Command.down()", "Command.left()", "Command.right()", "Command.retour()");
clavierPage = new ClavierVirtuel(nomClavierPage, actionClavierPage);

nomClavierOnglet = new Array("gauche", "droite", "fermer", "ouvrir", "retour");
actionClavierOnglet = new Array("Command.ongletLeft()", "Command.ongletRight()", "Command.ongletClose()", "Command.ongletAdd()", "Command.retour()");
clavierOnglet = new ClavierVirtuel(nomClavierOnglet, actionClavierOnglet);

nomClavierNumero = new Array();
actionClavierNumero = new Array();
for(let i = 0; i < 10; i++)
{
	nomClavierNumero.push(i);
	actionClavierNumero.push("Command.numero("+i+")");
}
nomClavierNumero.push("retour");
actionClavierNumero.push("Command.retour()");
clavierNumerique = new ClavierVirtuel(nomClavierNumero, actionClavierNumero, 3, 4);

nomClavierFav = new Array('ajouter', 'supprimer', 'retour');
actionClavierFav = new Array('Command.addFavori()', 'Command.deleteFavori()', 'Command.retour()');
let tmp = Command.recupFavoris();
nomClavierFav = nomClavierFav.concat(tmp[0]);
actionClavierFav = actionClavierFav.concat(tmp[1]);
clavierFavori = new ClavierVirtuel(nomClavierFav, actionClavierFav, Math.floor(Math.sqrt(nomClavierFav.length)), Math.ceil(Math.sqrt(nomClavierFav.length)));

nomClavierAlpha = new Array();
actionClavierAlpha = new Array();
for(let i = 97; i < 97 + 26; i++)
{
	nomClavierAlpha.push(String.fromCharCode(i));
	actionClavierAlpha.push("Command.caractere('"+String.fromCharCode(i)+"')");
}
nomClavierAlpha.push("retour");
actionClavierAlpha.push("Command.retour()");
clavierAlpha = new ClavierVirtuel(nomClavierAlpha, actionClavierAlpha, 5, 6);

clavierTest = new ClavierVirtuel(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'], [], 5, 3);

clavierCourant = clavierPrincipal;

/*
function murl()
{
	//alert(mainWindow.getBrowser().selectedBrowser.contentWindow.location.href);
	//mainWindow.getBrowser().selectedBrowser.contentWindow.location.href = "http://siteduzero.com";
	alert(mainWindow.getBrowser().selectedBrowser.contentWindow.document.getElementById('acces_rapide').innerHTML);
}

function googler()
{
	//var elt = document.getElementById("liberator-commandline-command");
	//commandline.triggerCallback("submit", this._currentExtendedMode, command);
	mainWindow.liberator.execute("tabopen http://www.google.fr");
}

function quitter()
{
	mainWindow.liberator.execute("xall");
}

function next()
{
	mainWindow.liberator.execute("forward");
	//document.getElementById("liberator-multiline-output").contentWindow.scrollByLines(1);
}

function back()
{
	mainWindow.liberator.execute("back");
}

function naviguer()
{
	urll = mainWindow.liberator.modules.buffer.URL;
	alert("url " + urll);
	let map = mainWindow.liberator.modules.mappings["get"](1, "f", urll);
	alert("map : " + map);
	map.execute(null, null);
}

function up()
{
	mainWindow.liberator.modules.buffer.scrollLines(-5);
}

function down()
{
	mainWindow.liberator.modules.buffer.scrollLines(5);
}

//string.charCodeAt(0); pour récupérer le code ascii
//String.fromCharCode(65) : pour récupérer la valeur du code
function numero(nb)
{
	var evt = document.createEvent("Events");
    evt.initEvent("keypress", true, true);

    evt.view = window;
    evt.altKey = false;
    evt.ctrlKey = false;
    evt.shiftKey = false;
    evt.metaKey = false;
    evt.keyCode = "" + nb;
    evt.charCode = ("" + nb).charCodeAt(0);
    
	mainWindow.liberator.modules.hints.onEvent(evt);
}

function ecrire()
{
	elem = mainWindow.liberator.modules.buffer.lastInputField;
	//alert(elem.innerHTML);
    elem.value+="ok";
    elem.focus();
}

function afficher()
{
	//document.getElementsByTagName('button')[0].setAttribute("style", "color:blue");
	var champ = document.getElementById('champBouton');
	//champ.setAttribute("style", "background-color:blue");
	champ.setAttribute("hidden", "true");
}

var i = 0;
function afficher2()
{
	elems = document.getElementsByTagName('button');
	i = i % elems.length;
	if (i - 1 >= 0)
		elems[i-1].setAttribute("style", "color:black");
	if (i == 0)
		elems[elems.length-1].setAttribute("style", "color:black");
	elems[i].setAttribute("style", "color:red");
	i = i + 1;
	setTimeout("afficher2()", 1000);
}
//*/