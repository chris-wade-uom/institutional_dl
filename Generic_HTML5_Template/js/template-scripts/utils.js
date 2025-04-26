// JavaScript Document
/* Created by Stuart Anderson FSE elearning team */


/***
 *** Page initialisation...
 ***/
window.onload = function() 
{
	// If content embedded in VLE/CMS and perform a few UX improvements
	if( inIframe() ) {
		// Insecure links within HTTPS iframes will break unless opened in new window
		if( window.parent.location.protocol == "https:") {
			makeInsecureLinksOpenInNewWindow();
		}
	}
	
	// Relies on 'printview' parameter being set on URL.  
	// c.f. See openPrintView()
	if(getURLParameter('printview') == 'true') {
		enablePrintView();
	}
	
	// Always check to see if tables need horizontal scrolling
	highlightXScrollingTables();
}

window.onresize = function() 
{
	highlightXScrollingTables();
}




/***
 *** Fix HTTP links inside HTTPS hosted iFrames.
 *** This prevents problems with insecure HTTP links failing to work if hosted inside
 *** a secure HTTPS parent frame.  In such cases, these links will be set to open in
 *** a new window.
 ***/
function makeInsecureLinksOpenInNewWindow() 
{
	var a = null, protocol = null,
		anchors = document.body.getElementsByTagName("a");

	for (var i=0; i < anchors.length; i++){
		a = anchors[i];
		protocol = a.href.substring(0, a.href.indexOf(":"));

		if( protocol == "http" || protocol == "ftp" ) {
			a.setAttribute('target', '_blank');
		}
	}
}

function inIframe() 
{
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
 
		 
/***
 *** Usability enhancements.
 *** Provides functions to improve usability.  Where the screen width is narrow and a table won't fit horizontally,
 *** the highlightXScrollingTables() will search for such tables and add the class name "scrolling" to the table.
 *** This can then be custom styled as needed to add scrolling and make labels visible to indicate horizontal scrolling.
 *** See also "css/theme-base-styles.css" under the "Responsive Tables" section for styling.
 ***/
function highlightXScrollingTables() 
{
	var className = "scrolling",
		table = null,
		tables = document.body.getElementsByTagName("table");
	
	for (var i=0; i < tables.length; i++){
		table = tables[i];

		var element = table.parentElement;
		var style = element.currentStyle || window.getComputedStyle(element),
		    parentWidth = element.clientWidth, 
		    parentPadding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
		    parentContentWidth = parentWidth - parentPadding;

		    console.log("parentContentWidth: " + parentContentWidth);

		// Add class style to tables which scroll horizontally
		if ( parentContentWidth < table.scrollWidth ) {
			addClass( table, className );
		} 
		else {
			removeClass( table, className );
		}
	}
}

function addClass( elem, cls ) 
{
	if( !hasClass( elem, cls) ) {
		if(elem.className) {
			cls = " " + cls;
		}
		elem.className += cls;
	}
}
function removeClass( elem, cls ) 
{
	if( hasClass( elem, cls) ) {
		elem.className = elem.className.replace(new RegExp('(?:^|\\s)'+cls+'(?!\\S)'), '');
	}
}
function hasClass( elem, cls ) 
{
	return (' ' + elem.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
	

	
/***
 *** Print view functions.
 *** Provides functionality to allow a page to 'break out' of any internal frame (iframe)
 *** so that the page can be cleanly printed.  Also provides a means to make any print only
 *** style sheets be applied to the "screen" view too therefore creating the nearest thing
 *** possible to a print view without resorting to generating PDFs on the fly.
 ***/
 
function enablePrintView()
{
	var printStyles = [],
		allStyleSheets = document.styleSheets; // returns an Array-like StyleSheetList
	
	// Grab all style sheets which contain media type for "print"
	for(var i = 0; i < allStyleSheets.length; i++) {
		for(var j = 0; j < allStyleSheets[i].media.length; j++) {
			
			if( allStyleSheets[i].media.item(j) == "print" ) {
				printStyles.push(allStyleSheets[i]);
	
			}
		}
	}

	// Append the "screen" media type so print styles display to user
	for(var i = 0; i < printStyles.length; i++) {
		printStyles[i].media.appendMedium("screen"); 
	}

}
 
function getURLParameter(name)
{
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec(document.URL);
    if( results == null ) { return ""; }
    else { return results[1]; }
}

function updateURLParameter(uri, key, value) 
{
  // remove the hash part before operating on the uri
  var i = uri.indexOf('#');
  var hash = i === -1 ? ''  : uri.substr(i);
  uri = i === -1 ? uri : uri.substr(0, i);

  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";

  if (!value) {
    // remove key-value pair if value is empty
    uri = uri.replace(new RegExp("([?&]?)" + key + "=[^&]*", "i"), '');
    if (uri.slice(-1) === '?') {
      uri = uri.slice(0, -1);
    }
    // replace first occurrence of & by ? if no ? is present
    if (uri.indexOf('?') === -1) uri = uri.replace(/&/, '?');
  } else if (uri.match(re)) {
    uri = uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    uri = uri + separator + key + "=" + value;
  }
  return uri + hash;
}

function openPrintView()
{
    var printUrl = updateURLParameter(document.URL, "printview", "true");
    var msgWindow = this.open( printUrl );
    if (window.focus) {msgWindow.focus();}
    return false;
}



/***
 *** Page last modified information. 
 *** Automatically adds a date-time stamp to indicate the last time a page was modified
 ***/

function getLastModifiedDateMessage() 
{
	var d = convertDateToStringComponents(new Date(document.lastModified) );
	var message = 'Page last modified: ';
		message +='<time datetime="' + d.yyyy+"-"+d.mm+"-"+d.dd+" "+d.hh+":"+d.mn + '">';
		message +=d.dd+"/"+d.mm+"/"+d.yyyy+" at "+d.hh+":"+d.mn + '</time>';
	return message;
}

function convertDateToStringComponents( date ) 
{
	
	var yyyy = date.getFullYear(), 
		mm = (date.getMonth()+1),  
		dd = date.getDate(),
		hh = date.getHours(),
		mn = date.getMinutes();
		
	// Pad the numbers out and ensure numbers are now handled as Strings not numbers
	mm = mm < 10 ? "0"+mm : ""+mm;
	dd = dd < 10 ? "0"+dd : ""+dd;
	hh = hh < 10 ? "0"+hh : ""+hh;
	mn = mn < 10 ? "0"+mn : ""+mn;
	
	// Return an object containing date compontents
	return { "yyyy" : yyyy, "mm" : mm, "dd" : dd, "hh" : hh, "mn" : mn };
}
