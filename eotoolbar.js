
document.body.style.border = "5px solid red";

//var BrowserToolbarPalette = document.createElement("toolbarpalette");

var eotoolbar_button = document.createElement("toolbarbutton");
function coucou() { alert("COUCOU"); }
//eotoolbar-button
browser.BrowserAction.onClicked.addListener(coucou);
document.getElementById("BrowserToolbarPalette").appendChild(eotoolbar_button);
