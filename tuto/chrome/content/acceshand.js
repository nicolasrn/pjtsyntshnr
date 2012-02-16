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

Utils.pause = function (ms) {
	ms += new Date().getTime();
	while (new Date() < ms){}
}

mutils = new Utils();

function TimerBalayage() 
{
    var interval=200; //ms
    var onTimerCallBack=null;
    var tickCount=0; //time elapse
    var enabled=false; //run timer

    //set interval in ms
    this.setInterval=function(_interval) {
        interval=parseInt(_interval);
    };
    //start timer
    this.start=function () {   
        enabled=true;  
        onTimerCallBack.call();
        setTimeout(function() {internalOnTimer.apply(this, arguments)}, 200);
    };
    //stop timer
    this.stop=function() {
        enabled=false;
    };
    //get time elapse since first start in ms
    this.getTickCount=function() {
        return tickCount;
    };
    //set function to call on each timeOut
    this.setCallBack=function(_callBackfunction) {
        onTimerCallBack=_callBackfunction;
    }
    //set internal time to 0
    this.reset=function() {
        tickCount=0;
    }

    /**
   * private
   */
    var internalOnTimer=function() {
        tickCount+=interval;
        onTimerCallBack.call();
        if (enabled) {
            setTimeout(function() {
                internalOnTimer.apply(this, arguments)
            },interval);
        }
    }
}


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

function debug(str)
{
	document.getElementById('debug').value = str + "\n" + document.getElementById('debug').value;
}

/**
* Classe qui gère le dessin du balayage
*/
Balayage = {
	debutX: 0,
	debutY: 0,
	finX : screen.width,
	finY: 0,
	clicX: 0,
	clicY: 0,
	dessinV: false,
	stop: 0,
	myContainer: null,
	
	//Fonction permettant de tracer une ligne en JS
	drawLine: function (x1,y1,x2,y2,color,espacementPointille)
	{
		if(espacementPointille<1) { espacementPointille=1; }
		
		//on calcule la longueur du segment
		lg=Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
		
		//on determine maintenant le nombre de points necessaires
		nbPointCentraux=Math.ceil(lg/espacementPointille)-1;
		
		//stepX, stepY (distance entre deux points de pointillés);
		stepX=(x2-x1)/(nbPointCentraux+0);
		stepY=(y2-y1)/(nbPointCentraux+0);
		
		//on recreer un point apres l'autre
		strNewPoints='';
		for(i=1 ; i<nbPointCentraux ; i++)
		{
			strNewPoints+='<div style="font-size:1px; width:1px; height:1px; background-color:'+color+'; position:absolute; top:'+Math.round(y1+i*stepY)+'px; left:'+Math.round(x1+i*stepX)+'px; ">&nbsp;</div>';
		}
		
		//pointe de depart
		strNewPoints+='<div style="font-size:1px; width:3px; height:3px; background-color:'+color+'; position:absolute; top:'+(y1-1)+'px; left:'+(x1-1)+'px; ">&nbsp;</div>';
		//point d'arrive
		strNewPoints+='<div style="font-size:1px; width:3px; height:3px; background-color:'+color+'; position:absolute; top:'+(y2-1)+'px; left:'+(x2-1)+'px; ">&nbsp;</div>';

		
		//on suprimme tous les points actuels et on mets les nouveaux div en place
		//obj container des points
		this.myContainer.innerHTML=strNewPoints;
	},
	
	dessinerH: function ()
	{	
		Balayage.drawLine(Balayage.debutX,Balayage.debutY,Balayage.finX,Balayage.finY,"red",1.0);
		Balayage.debutY += 2;
		Balayage.finY += 2;
		if (Balayage.debutY>screen.height){
			Balayage.debutY = 0;
			Balayage.finY = 0;
		}
	},

	dessinerV: function ()
	{	
		Balayage.drawLine(Balayage.debutX,Balayage.debutY,Balayage.finX,Balayage.finY,"red",1.0);
		Balayage.debutX += 2;
		Balayage.finX += 2;
		if (Balayage.debutX>screen.width){
			Balayage.debutX = 0;
			Balayage.finX = 0;
		}
	},

	choixDessin: function (container){	
		timerB = new TimerBalayage();
		this.myContainer = container;
		if (!this.dessinV){
			this.debutX = 0;
			this.debutY = 0;
			this.finX = screen.width;
			this.finY = 0;
			timerB.setCallBack(this.dessinerH);
		}
		else{
			this.debutX = 0;
			this.debutY = 0;
			this.finX = 0;
			this.finY = screen.height;
			timerB.setCallBack(this.dessinerV);
		}		
		timerB.start();
	},

	stopDessin: function(){
		timerB.stop();
		if (this.stop == 0){
			this.clicY = this.debutY;
			this.dessinV = !this.dessinV;
			this.stop = 1;
			this.choixDessin(this.myContainer);
		}
		else{
			this.clicX = this.debutX;
			timerB.stop();
			this.stop = 0;
			this.dessinV = !this.dessinV;
			delete(timerB);	
		}
	}	
}

transcription = 
{
	"11" : ["101", "69"],
	"12" : ["115", "83"],
	"13" : ["97", "65"],
	"14" : ["110", "78"],
	"15" : ["114", "82"],
	"16" : ["117", "85"],
	"17" : ["118", "86"],
	"18" : ["32", "32"],
	"19" : ["44", "44"],
	"20" : ["", ""],
	"21" : ["105", "73"],
	"22" : ["108", "76"],
	"23" : ["111", "79"],
	"24" : ["39", "52"],
	"25" : ["113", "81"],
	"26" : ["102", "70"],
	"27" : ["135", "57"],
	"28" : ["94", "94"],
	"29" : ["34", "51"],
	"30" : ["", ""],
	"31" : ["116", "84"],
	"32" : ["100", "68"],
	"33" : ["99", "67"],
	"34" : ["133", "48"],
	"35" : ["98", "66"],
	"36" : ["103", "71"],
	"37" : ["122", "90"],
	"38" : ["58", "37"],
	"39" : ["119", "87"],
	"40" : ["", ""],
	"41" : ["112", "80"],
	"42" : ["104", "72"],
	"43" : ["106", "74"],
	"44" : ["40", "40"],
	"45" : ["41", "41"],
	"46" : ["138", "55"],
	"47" : ["64", "49"],
	"48" : ["60", "60"],
	"49" : ["91", "93"],
	"50" : ["", ""],
	"51" : ["109", "77"],
	"52" : ["46", "53"],
	"53" : ["45", "45"],
	"54" : ["47", "/"],
	"55" : ["63", "54"],
	"56" : ["151", "56"],
	"57" : ["8", "8"],
	"58" : ["59", "61"],
	"59" : ["", ""],
	"60" : ["", ""],
	"61" : ["130", "50"],
	"62" : ["120", "88"],
	"63" : ["121", "89"],
	"64" : ["33", "43"],
	"65" : ["107", "75"],
	"66" : ["42", "42"],
	"67" : ["13", "39"],
	"68" : ["", "38"],
	"69" : ["", "37"]
}

/**
 *Classe ou tableau associatif regroupant les différentes commandes boutons
 */
Command = {
	utils: mutils,
	
	tailleBouton: 50,
	
	timerNavigation: false,

	nbSaisi: 0,
	buff: "",
	typeEntre: 0, /*0 = minuscule; 1 = majuscule*/
	
	buttonPressed: function () 
	{
		Utils.pause(1000);
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
		Command.nbSaisi = 0;
	},

	favoris: function()
	{
		clavierPrec = clavierCourant;
		clavierCourant = clavierFavori;
		clavierCourant.display();
		//clavierCourant.parcourir();
	},
	
	balayage: function()
	{
		
		clavierPrec = clavierCourant;
		clavierCourant = clavierBalayage;
		clavierCourant.display();		
		myDiv = '<div id="myDiv"><\div>';
		this.utils.getMainWindow()._content.document.getElementsByTagName("body")[0].innerHTML += myDiv;		
		c = this.utils.getMainWindow()._content.document.getElementById("myDiv");
		Balayage.choixDessin(c);
		
	},
	
	balayer: function()
	{
		Balayage.stopDessin();
	},
	
	clicBalayage: function()
	{
		Balayage.stopDessin();
		Command.retour();
		//simuler le clic en (Balayage.clicX, Balayage.clicY)
		//alert(Balayage.clicX+" : "+Balayage.clicY);
		
		let page = document.getElementById("mainPage");
		//debug(Utils.getKeys(document.getElementById("mainPage")).join("\n"));
		//alert("top : " + page.clientTop + "\n" + "clientLeft : " + page.clientLeft + "\n" + "clientHeight : " + page.clientHeight + "\n" + "clientWidth : " + page.clientWidth);
		
		$.ajax({
			   type: "GET",
			   url: "http://localhost/Site/projet%20synthese/cgi/Debug/cgi.cgi",
			   data: "x="+(Balayage.clicX + page.clientWidth)+"&y="+(Balayage.clicY + 63),
			   success: function(msg)
			   {
				   alert(msg);
			   },
			   error: function(jqXHR, textStatus, errorThrown)
			   {
				   //alert("pepin " + jqXHR + "\n" + textStatus + "\n" + errorThrown);
			   }
			 });
	},
	
	navigation: function()
	{
		urll = this.utils.getMainWindow().liberator.modules.buffer.URL;
		//let map = this.utils.getMainWindow().liberator.modules.mappings["get"](1, "f", urll);
		//map.execute(null, null);
		this.utils.getMainWindow().liberator.modules.hints.show('o', undefined, undefined, true, false);
		this.numerique();
		//timer.urlPagePred = this.utils.getMainWindow().getBrowser().selectedBrowser.contentWindow.location.href;
		//if (this.timerNavigation == false)
		//{
		//	this.timerNavigation = true;
		//	timer.start();
		//}
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
		key.initKeyEvent("keypress", true, true, null, false, false, false, false, 0, char);
		//key.initKeyEvent("keypress", true, true, null, false, false, false, false, /*ici pour les caracteres speciaux*/, 0);
		target.dispatchEvent(key);
		key.stopPropagation;
	},
	
	clavierIntuitif: function(char)
	{
		Command.nbSaisi = Command.nbSaisi + 1;
		try
		{
			if (Command.nbSaisi == 2)
			{
				Command.buff += char;
				switch (Command.buff)
				{
					case "67":
					case "57":
					case "69":
					case "67":
						Command.special(transcription[Command.buff][Command.typeEntre]);
						break;
					case "59":
						if (document.getElementById("clavier").getAttribute("class") == "Minuscule")
						{
							document.getElementById("clavier").setAttribute("class", "Majuscule");
							Command.typeEntre = 1;
						}
						else
						{
							document.getElementById("clavier").setAttribute("class", "Minuscule");
							Command.typeEntre = 0;
						}
					default:
						Command.caractere(transcription[Command.buff][Command.typeEntre]);
				}
				Command.buff = "";
				Command.nbSaisi = 0;
			}
			else
			{
				Command.buff += char;
			}
		}
		catch(e)
		{
			Command.buff = "";
			Command.nbSaisi = 0;
		}
		//alert(Command.nbSaisi);
	},
	
	special: function(char)
	{
		let target = this.utils.getMainWindow().liberator.modules.buffer.lastInputField;
		target.focus();
		let key = target.ownerDocument.createEvent("KeyEvents");
		key.initKeyEvent("keypress", true, true, null, false, false, false, false, char, 0);
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
	
	//précédent
	left: function()
	{
		this.utils.getMainWindow().gBrowser.goBack();
	},
	
	//suivant
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
	
	//onglet droit
	ongletRight: function()
	{
		this.utils.getMainWindow().gBrowser.tabContainer.advanceSelectedTab(1, true);
	},
	
	//fermer l'onglet courrant
	ongletClose: function()
	{
		this.utils.getMainWindow().gBrowser.removeCurrentTab();
	},
	
	//ajouter un onglet
	ongletAdd: function()
	{
		// Add tab    
		this.utils.getMainWindow().gBrowser.addTab("http://www.google.com/");  
		//gBrowser.selectedTab = gBrowser.addTab("http://www.google.com/"); 
	},

	//naviguer à une URL
	naviguer: function(url)
	{
		//accede a l'url entree en parametre	
		this.utils.getMainWindow().gBrowser.addTab(url); 
	},
	
	recupFavoris: function()
	{
		/*let bookmarks = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
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
		return [nom, action];*/
		var file = Components.classes["@mozilla.org/file/directory_service;1"]
			.getService(Components.interfaces.nsIProperties)
			.get("TmpD", Components.interfaces.nsIFile);
		file.append("favoris.txt");	
		if (!file.exists())
			file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);			
		// ouvrir un flux entrant depuis le fichier
		var istream = Components.classes["@mozilla.org/network/file-input-stream;1"]
								.createInstance(Components.interfaces.nsIFileInputStream);
		istream.init(file, 0x01, 0444, 0);
		istream.QueryInterface(Components.interfaces.nsILineInputStream);

		// lire les lignes dans un tableau
		var line = {}, lines = [], hasmore;
		do {
		  hasmore = istream.readLine(line);
		  lines.push(line.value); 
		} while(hasmore);

		istream.close();
		
		// traitement des données lues
		nomFavori=new Array();
		urlFavori = new Array();
		for (i=0;i<lines.length;i++)
		{
			var dep = lines[i].indexOf(';');
			var nom = lines[i].substring(0,dep);	
			var url = lines[i].substring(dep+1,lines[i].length);
			nomFavori.push(nom);
			urlFavori.push(url);
		}		
	},

	creerClavierFavori: function()
	{
		//clavier des favoris
		//recuperation des favoris dans un tableau pou le nom et un autre pour l'url
		Command.recupFavoris();
		actionUrl = new Array();
		for(i=0;i<urlFavori.length;i++)
		{
			actionUrl.push("Command.naviguer(\""+urlFavori[i]+"\")");
		}
		//creation des menus supplementaires des favoris et concatenation avec les tableaux précedents
		nom = new Array("supprimer", "ajouter", "retour");
		nom = nomFavori.concat(nom);
		action = new Array("Command.deleteFavori()", "Command.addFavori()", "Command.retour()");
		action = actionUrl.concat(action);
		//creation du clavier définitif
		clavierFavori = new ClavierVirtuel(nom, action);
	},
	
	deleteFavori: function()
	{
		/*
		 * With the bookmarks service:
		 * removeItem(aItemId) - Works for all types
		 * removeFolder(aItemId) - Works for folders and livemarks
		 * removeFolderChildren(aItemId) - Works for folders and livemarks
		 */
		 /*
		let bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		let ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		let uri = ios.newURI(this.utils.getMainWindow().liberator.modules.buffer.URL, null, null);
		let bookmarksArray = bmsvc.getBookmarkIdsForURI(uri, {});
		
		for(let i = 0; i < bookmarksArray.length; i++)
			bmsvc.removeItem(bookmarksArray[i]);*/
			//recupération des informations à supprimer
		urlS = this.utils.getMainWindow().liberator.modules.buffer.URL;
		d = urlS.indexOf('.')+1;
		nomPageS = urlS.substring(d);		
		f = nomPageS.indexOf('.'); 
		nomPageS = nomPageS.substring(0,f);
		//recherche du nom de page à supprimer
		i=0;
		while((nomFavori[i]!=nomPageS) && (i<nomFavori.length)){
			i++;
		}
		//si le nom est bien dans les favoris
		if(i<nomFavori.length)
		{
			//échange de la 1ere valeur avec la valeur à supprimer
			temp=nomFavori[0];
			nomFavori[0]=nomFavori[i];
			nomFavori[i]=temp;
			temp=urlFavori[0];
			urlFavori[0]=urlFavori[i];
			urlFavori[i]=temp;
			//suppression dans le tableau nomFavori et urlfavori de la 1ere valeur
			nomFavori.shift();
			urlFavori.shift();
			//réécriture du fichier mis à jour
			//ecriture de l'information dans le fichier texte adequate de la forme nom;url sur chaque ligne
			var file = Components.classes["@mozilla.org/file/directory_service;1"]
						.getService(Components.interfaces.nsIProperties)
						.get("TmpD", Components.interfaces.nsIFile);
			file.append("favoris.txt");
			if(file.exists())
				file.remove(true);
			file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0664);		 
			// file est un nsIFile, data est une chaîne de caractères
			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
									.createInstance(Components.interfaces.nsIFileOutputStream);
			// utiliser 0x02 | 0x10 pour ouvrir le fichier en ajout.
			foStream.init(file,0x02|0x10, 0664, 0); // écrire, créer, tronquer
			for(i=0;i<nomFavori.length;i++)
			{
				foStream.write(nomFavori[i]+";", nomFavori[i].length++);		
				foStream.write(urlFavori[i]+"\r\n", urlFavori[i].length+3);
			}
			foStream.close();
		}
		Command.retour();
		delete (clavierFavori);
		clavierCourant=clavierPrincipal;
		Command.creerClavierFavori();
		clavierFavori.createKeyBoard('boxClavierFavori');
		Command.favoris();
	},
	
	addFavori: function()
	{
	/*
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
		//alert("ok");*/
		
		/*
		 * sofiane
		 */
		url = this.utils.getMainWindow().liberator.modules.buffer.URL;
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
		foStream.write("\r\n"+nomPage+";", nomPage.length+4);		
		foStream.write(url, url.length);
		foStream.close();
		//mise a jour de l'affichage
		Command.retour();
		delete (clavierFavori);
		clavierCourant=clavierPrincipal;
		Command.creerClavierFavori();
		clavierFavori.createKeyBoard('boxClavierFavori');
		Command.favoris();
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
	
	this.parent = null;
	
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
			this.parent = idParent;
			
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
			
			document.getElementById(this.parent).setAttribute("hidden", "true");
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
		document.getElementById(this.parent).setAttribute("hidden", "false");
	}
	
	//masque le clavier
	this.hidden = function()
	{
		this.cntPrincipal.setAttribute("hidden", "true");
		document.getElementById(this.parent).setAttribute("hidden", "true");
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

nomClavierPrincipal = new Array(	"onglet", 			"page", 		    "clavier", 			"favoris", 			 "lien",               	 "Balayage");
actionClavierPrincipal = new Array("Command.onglet()", "Command.page()", "Command.alpha()", "Command.favoris()", "Command.navigation()", "Command.balayage()");
clavierPrincipal = new ClavierVirtuel(nomClavierPrincipal, actionClavierPrincipal);

nomClavierPage = new Array("monter", "descendre", "précédent", "suivant", "retour");
actionClavierPage = new Array("Command.up()", "Command.down()", "Command.left()", "Command.right()", "Command.retour()");
clavierPage = new ClavierVirtuel(nomClavierPage, actionClavierPage);

nomClavierOnglet = new Array("gauche", "droite", "fermer", "ouvrir", "retour");
actionClavierOnglet = new Array("Command.ongletLeft()", "Command.ongletRight()", "Command.ongletClose()", "Command.ongletAdd()", "Command.retour()");
clavierOnglet = new ClavierVirtuel(nomClavierOnglet, actionClavierOnglet);

nomClavierBalayage = new Array("balayer", "clic");
actionClavierBalayage = new Array("Command.balayer()", "Command.clicBalayage()");
clavierBalayage = new ClavierVirtuel(nomClavierBalayage, actionClavierBalayage);

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

Command.creerClavierFavori();

/*nomClavierAlpha = new Array('1', '2', '3', '4', '5', '6', 
							'7', '8', '9', '0', '<-', 'a',
							'z', 'e', 'r', 't', 'y', 'u', 
							'i', 'o', 'p', 'entre', 'q', 's', 
							'd', 'f', 'g', 'h', 'j', 'k',
							'l', 'm', 'w', 'x', 'c', 'v',
							'b', 'n', 'gauche', 'droit', 'bas', 'haut');*/
nomClavierAlpha = new Array('1', '2', '3', '4', '5', '6', '7', '8', '9', '0');
actionClavierAlpha = new Array();

for(let i = 0; i < nomClavierAlpha.length; i++)
	actionClavierAlpha.push("Command.clavierIntuitif('"+nomClavierAlpha[i]+"')");

/*actionClavierAlpha[10] = "Command.special(8)";
actionClavierAlpha[21] = "Command.special(13)";
actionClavierAlpha[38] = "Command.special(37)";
actionClavierAlpha[39] = "Command.special(39)";
actionClavierAlpha[40] = "Command.special(40)";
actionClavierAlpha[41] = "Command.special(38)";*/

nomClavierAlpha.push("retour");
actionClavierAlpha.push("Command.retour()");
//clavierAlpha = new ClavierVirtuel(nomClavierAlpha, actionClavierAlpha, 8, 6);
clavierAlpha = new ClavierVirtuel(nomClavierAlpha, actionClavierAlpha, 4, 3);

clavierCourant = clavierPrincipal;
