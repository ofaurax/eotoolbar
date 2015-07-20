
var EsperantoToolbar = {};

EsperantoToolbar.pref = Components.classes["@mozilla.org/preferences-service;1"].
getService(Components.interfaces.nsIPrefBranch);

EsperantoToolbar.dump = function(arg)
{
    //return dump(arg); // disable in prod
}

EsperantoToolbar.httpRequest = new XMLHttpRequest();
EsperantoToolbar.httpRequest.overrideMimeType('text/xml');
EsperantoToolbar.httpRequest.onreadystatechange = function()
{
    if(EsperantoToolbar.httpRequest.readyState != 4)
    {
	EsperantoToolbar.dump("Not ready\n");
	return;
    }

    if(EsperantoToolbar.httpRequest.status == 200)
    {
	EsperantoToolbar.dump("Esperanto toolbar ok\n");//+req.responseText);
	var rss = EsperantoToolbar.httpRequest.responseXML;
	var items = rss.getElementsByTagName("item");
	for(var i=0; i<items.length; i++)
	{
	    EsperantoToolbar.dump("items["+i+"]: "+items[i]+"\n");
	    var title = items[i].getElementsByTagName("title")[0];
	    var link = items[i].getElementsByTagName("link")[0];
	    if(title && link)
	    {
		EsperantoToolbar.dump('> '+title.textContent+' '+link.textContent+"\n");
		
		var info = document.getElementById('eotoolbar-inforss');
		info.setAttribute("oncommand",
				  "window._content.location.href = '"+
				  link.textContent+"';");
		info.setAttribute("label", title.textContent);
		break;
	    }
	}
	
    }
    else
	EsperantoToolbar.dump(
	    "Esperanto toolbar http error: "+EsperantoToolbar.httpRequest.status+"\n");
}

EsperantoToolbar.novigiRSS = function()
{
    var req = new XMLHttpRequest();
    var url = "http://ofaurax.free.fr/xul/eotb-inforss.php5";
    //url = "http://ofaurax.free.fr/rss.php5";
    EsperantoToolbar.httpRequest.open('GET', url, true);
    EsperantoToolbar.httpRequest.send(null);
}

EsperantoToolbar.aldoniButonoj = function()
{
  window.removeEventListener("load", EsperantoToolbar.aldoniButonoj, true);

  var eotb_serĉejo = document.getElementById('eotoolbar-revo');
  eotb_serĉejo.addEventListener("keydown", EsperantoToolbar.revo_klaku, true);

  var eotb = document.getElementById('eotoolbar');
  eotb.collapsed = EsperantoToolbar.pref.getBoolPref("extensions.eotoolbar.tbnevidebla");

  var butonoj = ['ĉ', 'ĝ', 'ĥ', 'ĵ', 'ŝ', 'ŭ', 'Ĉ', 'Ĝ', 'Ĥ', 'Ĵ', 'Ŝ', 'Ŭ'];
  var butonoj2 = ['c', 'g', 'h', 'j', 's', 'u',
	       'Shift+c', 'Shift+g', 'Shift+h', 'Shift+j', 'Shift+s', 'Shift+u'];

  for(var i=0; i<butonoj.length ; i++)
  {
    var butono = document.createElement('toolbarbutton');

    butono.setAttribute('label', butonoj[i]);
    butono.setAttribute('tooltiptext', 'Skribu '+butonoj[i]+' (Ctrl+Alt+'+butonoj2[i]+')');
    butono.setAttribute('id', 'eotoolbar-'+butonoj[i]);
    butono.setAttribute('class', 'eotoolbar-litero-butono');
    butono.setAttribute('oncommand', 'EsperantoToolbar.klaku("'+butonoj[i]+'");');

    //    eotb.appendChild(butono);

    var sep = document.getElementById('postbutonoj');
    eotb.insertBefore(butono, sep);
  }

    EsperantoToolbar.novigiRSS();

// Aldonas la butono en la ilbreto
// http://developer.mozilla.org/en/docs/Code_snippets:Toolbar
  try {
    var firefoxnav = document.getElementById("nav-bar");
    var curSet = firefoxnav.currentSet;
 
    if (curSet.indexOf("eotoolbar-button") == -1)
    {
      var set;
     // Place the button before the urlbar
      if (curSet.indexOf("urlbar-container") != -1)
        set = curSet.replace(/urlbar-container/, "eotoolbar-button,urlbar-container");
      else  // at the end
        set = firefoxnav.currentSet + ",eotoolbar-button";

      firefoxnav.setAttribute("currentset", set);
      firefoxnav.currentSet = set;
      document.persist("nav-bar", "currentset");
      // If you don't do the following call, funny things happen
      try { BrowserToolboxCustomizeDone(true); } catch(e) { }
    }
  }
  catch(e) { alert(e); }
}

EsperantoToolbar.klaku = function(c)
{
  var evt = document.createEvent("KeyboardEvent");
  evt.initKeyEvent(
  "keypress", true, true, null, false, false, false, false, 0, c.charCodeAt());
  document.commandDispatcher.focusedElement.dispatchEvent(evt);
}

EsperantoToolbar.baskuli = function()
{
  var eotb = document.getElementById('eotoolbar');
  var eotb_serĉejo = document.getElementById('eotoolbar-revo');
  eotb.collapsed = !eotb.collapsed;
  EsperantoToolbar.pref.setBoolPref("extensions.eotoolbar.tbnevidebla", eotb.collapsed);
  if(!eotb.collapsed)
  {
    //eotb_serĉejo.focus();
    eotb_serĉejo.select();
  }
}

EsperantoToolbar.serĉu = function(typo)
{
    var vorto = document.getElementById('eotoolbar-revo').value;
    
    if(typo === undefined) typo = 1;
    
    switch(typo)
	{
	case 0: // ReVo en nuna folio
	    window._content.location.href =
		'http://www.reta-vortaro.de/cgi-bin/sercxu.pl'+
		'?ref=eotoolbar&kadroj=1&sercxata='
		+vorto;
	    break;
	case 1: // ReVo en nova folio 
	    gBrowser.selectedTab =
		gBrowser.addTab('http://www.reta-vortaro.de/cgi-bin/sercxu.pl'
				+'?ref=eotoolbar&kadroj=1&sercxata='
				+vorto);
	    break;
	case 2: // ReVo per Google (ne uzita)
	    window._content.location.href =
		'http://www.google.fr/search?hl=eo&sitesearch=reta-vortaro.de&q='+vorto;
	    break;
	default:
	    alert('Esperanto Toolbar : eraro en typo :'+typo);
	}
	
}

EsperantoToolbar.revo_klaku = function(evento)
{
	if (evento.keyCode == 13) // "enter" klakita !
	{
		document.getElementById('eotoolbar-revo-butono').doCommand();
	}
//	alert('revo klaku '+evento.keyCode);
}

// Nur unue / only once
window.addEventListener("load", EsperantoToolbar.aldoniButonoj, true);




