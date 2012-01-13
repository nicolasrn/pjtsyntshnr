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

Utils.prototype.getValuesOfKeys = function(obj)
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

/**
 *Classe ou tableau associatif regroupant les différentes commandes boutons
 */
Command = {
	utils: mutils,
	
	timerNavigation: false,
	
	//appelé lors de la détection d'un clic
	buttonPressed: function (event) {
		clavierCourant.stop();
		//alert("selectionné : " + clavierCourant.getSelectedButton());
		clavierCourant.execute();
		clavierCourant.start();
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
		//let map = this.utils.getMainWindow().liberator.modules.mappings["get"](1, "f", urll); show('o', undefined, undefined)
		//map.execute(null, null); 
		this.utils.getMainWindow().liberator.modules.hints.show('o', undefined, undefined, true, true);
		this.numerique();
		timer.urlPagePred = this.utils.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href;
		if (this.timerNavigation == false)
		{
			this.timerNavigation = true;
			timer.start();
		}
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
	    let elem = this.utils.getMainWindow().liberator.modules.buffer.lastInputField;
	    elem.value += char;
   	    elem.focus();
   	    /*let evt = document.createEvent("Events");
	    evt.initEvent("keydown", true, true);
	    
	    let elem = this.utils.getMainWindow().liberator.modules.buffer.lastInputField;
	    elem.addEventListener("keydown", fctEcrire, true);
		
	    evt.view = elem;
	    evt.altKey = false;
	    evt.ctrlKey = false;
	    evt.shiftKey = false;
	    evt.metaKey = false;
	    evt.keyCode = 0;
	    evt.charCode = char.charCodeAt(0);*/
	    //alert(char.charCodeAt(0));
	    /*alert(code + "\n" + String.fromCharCode(code) + "\n" + code.charCodeAt(0));
	    let elem = this.utils.getMainWindow().liberator.modules.buffer.lastInputField;
	    elem.value += String.fromCharCode(code);
   	    elem.focus();*/
   	    
		//elem.dispatchEvent(evt);  
	},
	
	//fonction clavierPage
	//monter dans la page
	up: function()
	{
		this.utils.getMainWindow().liberator.modules.buffer.scrollLines(-5);
	},
	
	//descendre dans la page
	down: function()
	{
		this.utils.getMainWindow().liberator.modules.buffer.scrollLines(5);
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
	
	deleteFavori: function()
	{
	},
	
	addFavori: function()
	{
	}
}

/**
 *Classe permettant la gestion d'un clavier
 *@param keys : liste des touches sous forme de tableau de caractere
 *@param actionKeys : liste des actions associées au bouton sous forme tableau de chaine de caractère attention actionKeys[i] est associé à keys[i]
 *@param nomVar : nom de la variable utilisé pour faire la récursion avec setTimeOut
 */
function ClavierVirtuel(keys, actionKeys)
{
	//liste des touches sous formes de tableaux de caractère ou chaine
	this.keyTab = keys;
	//liste des actions associées aux boutons 
	this.actKeys = actionKeys;
	//tableau qui contient les boutons en tant qu'objet XUL
	this.buttonTab = new Array();
	//pour le balayage
	this.iterateur = 0;
	this.continuer = true;
	//pour l'appel récursif
	//this.varName = nomVar;
	
	this.selectedButton = 0;
	
	//pour l'affichage
	this.nbRow = 1;
	this.nbCol = this.keyTab.length;
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
	
	//initialisation du tableau de bouton
	for (let i = 0; i < this.keyTab.length; i++)
	{
		let boutton = this.addKey("" + this.keyTab[i], (Array.isArray(this.actKeys) ? this.actKeys[i] : this.actKeys));
		this.buttonTab.push(boutton);
	}
	
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
		if (this.created == false)
		{
			let box = document.getElementById(idParent);
			this.cntPrincipal = this.addVBox("filsDe"+idParent, false);
			let pos = 0;
			//alert("this.nbRow : " + this.nbRow + "\nthis.nbCol : " + this.nbCol);
			for (let i = 0; i < this.nbRow && pos < this.buttonTab.length - 1; i++)
			{
				let line = this.addHBox("c"+i, true);
				for(let j = 0; j < this.nbCol && pos < this.buttonTab.length - 1; j++)
				{
					pos = i * (this.nbRow-1) + j;
					//alert(i + " * " + (this.nbRow-1) + " + " + j + " = " + pos);
					line.appendChild(this.buttonTab[pos]);
				}
				this.cntPrincipal.appendChild(line);
			}
			box.appendChild(this.cntPrincipal);
			this.created = true;
		}
	}
	
	//execute l'action associé au bouton i
	this.execute = function()
	{
		//il suffit de simuler un clique
		this.buttonTab[this.selectedButton].click();
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
		this.selectedButton = this.iterateur - 1; //comme on incremente juste avant de l'appel récursif
		//alert("2");
		for(let i = 0; i < this.buttonTab.length; i++)
			this.buttonTab[i].setAttribute("style", "color:black");
		//alert("3");
		this.iterateur = 0;
		//alert("4");
	}
	
	this.start = function()
	{
		this.continuer = true;
		this.parcourir(this);
	}
	
	//balayage du clavier
	this.parcourir = function(self)
	{
		if (self.continuer)
		{
			//alert("a");
			//alert("self.iterateur : " + self.iterateur + "\nself.buttonTab.length : " + self.buttonTab.length);
			self.iterateur = self.iterateur % self.buttonTab.length;
			//alert("self.iterateur % self.buttonTab.length : " + self.iterateur);
			//alert("b");
			if (self.iterateur - 1 >= 0)
			{
			//	alert("c");
				self.buttonTab[self.iterateur-1].setAttribute("style", "color:black");
			}
			if (self.iterateur == 0)
			{
			//	alert("d");
				self.buttonTab[self.buttonTab.length-1].setAttribute("style", "color:black");
			}
			//alert("e");
			self.buttonTab[self.iterateur].setAttribute("style", "color:red");
			//alert("f");
			self.iterateur = self.iterateur + 1;
			//alert("g");
			//this.timer = setTimeout(this.varName+".parcourir()", 1000);
			clearTimeout(this.timer);
			self.timer = setTimeout(self.parcourir, 1000, self);
		}
	}
}

clavierCourant = null;
clavierPrec = null;

nomClavierPrincipal = new Array(	"onglet", 			"page", 		 "clavier", 			"favoris", 			 "lien", 				"retour");
actionClavierPrincipal = new Array("Command.onglet()", "Command.page()", "Command.alpha()", "Command.favoris()", "Command.navigation()", "Command.retour()");
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
clavierNumerique = new ClavierVirtuel(nomClavierNumero, actionClavierNumero);

nomClavierFavori = new Array("supprimer", "ajouter", "retour");
actionClavierFavori = new Array("Command.deleteFavori()", "Command.addFavori()", "Command.retour()");
clavierFavori = new ClavierVirtuel(nomClavierFavori, actionClavierFavori);

nomClavierAlpha = new Array();
actionClavierAlpha = new Array();
for(let i = 97; i < 97 + 26; i++)
{
	nomClavierAlpha.push(String.fromCharCode(i));
	actionClavierAlpha.push("Command.caractere('"+String.fromCharCode(i)+"')");
}
nomClavierAlpha.push("retour");
actionClavierAlpha.push("Command.retour()");
clavierAlpha = new ClavierVirtuel(nomClavierAlpha, actionClavierAlpha);

clavierCourant = clavierPrincipal;


//*
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