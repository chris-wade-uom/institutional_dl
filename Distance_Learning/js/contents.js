// JavaScript Document	

jQuery(document).ready(function($){

	// SmartMenus jQuery init
	// we'll use this jQuery version just for the SmartMenus plugin to avoid conflicts
	
	var jqSM = $.noConflict(true);

	// note that now $ and jQuery are undefined and the SmartMenus functionality remains in jqSM

	(function($) {
		$(function() {
			$('#main-menu').smartmenus({
				subMenusSubOffsetX: 1,
				subMenusSubOffsetY: -8
			});
		});
	})(jqSM);

	
	// fix main nav menu to top of page when scrolling
	fixToTopOnScroll("#main-navigation");

	function fixToTopOnScroll(element) {
		// Stick the #nav to the top of the window
		var nav = $(element);
		var navHomeY = nav.offset().top;
		var isFixed = false;
		var $w = $(window);
		var _this = this;
		$w.scroll(function() {
			var scrollTop = $w.scrollTop();
			var shouldBeFixed = scrollTop > navHomeY;
			if (shouldBeFixed && !isFixed) {
				nav.css({
					position: 'fixed',
					top: 0,
					left: nav.offset().left,
					width: nav.width()
				});
				isFixed = true;
			}
			else if (!shouldBeFixed && isFixed)
			{
				nav.css({
					position: 'static'
				});
				isFixed = false;
			}
		});
	}	
	
	// hide print view option if not in BB frame
	/*
	if(!inIframe()){
		classAmendStyle("noicon printview", "none");
	}
	*/
	
	// create in page headings based on ToC list at top of page
	
	if(document.getElementById("contents-list")){

		var $lis = $('ol#contents-list li ol li');
		var sectionNum = document.getElementsByTagName("h1")[0].innerHTML;
		sectionNum = sectionNum.match(/\d+/)[0];
		var topCount = 0;
		var subCount = 1;
		var hRef, listTitle;

		document.getElementById("contents-list").setAttribute("style", "counter-reset: start " + sectionNum + ";" ); 

		for(var i=0; i < $lis.length; i++){

			hRef = $('ol#contents-list li a:eq(' + i + ')').attr('href');
			hRef = hRef.substring(hRef.indexOf("#") + 1);
			listTitle = $lis[i].getElementsByTagName('a')[0].innerHTML;

			if(hRef.indexOf("subtopic")!== -1){
				document.getElementById(hRef).innerHTML = sectionNum + "." + topCount + "." + subCount + " " + listTitle;
				subCount++;
			}
			else{
				document.getElementById(hRef).innerHTML = sectionNum + "." + (topCount+1) + " " + listTitle;
				topCount++;
				subCount = 1;
			}

		}
	}

	/* Toggle between adding and removing the "active" and "show" classes when the user clicks on one of the "Section" buttons. 
	The "active" class is used to add a background color to the current button when its belonging panel is open. 
	The "show" class is used to open the specific accordion panel */
	
	if(document.getElementsByClassName("accordion")){
		var acc = document.getElementsByClassName("accordion");
		var i;

		for (i = 0; i < acc.length; i++) {
			acc[i].onclick = function(){
				this.classList.toggle("active");
				this.nextElementSibling.classList.toggle("show");
			}
		}
	}
	
	// create links for prev and next buttons from menu structure

	if(document.getElementById("main-menu")){
		var menuLinks = document.getElementById("main-menu").getElementsByTagName('a');
		var len = menuLinks.length;
		var current = window.location.href;
		var currentPos = 0;
		var prevCount = document.getElementsByClassName("prev").length;
		var nextCount = document.getElementsByClassName("next").length;

		for(var i=0; i<len; i++){
			if(current == menuLinks[i].href){
				currentPos = i;
			}
		}

		if(currentPos != 0){
			for (var i=0; i < prevCount; i++){
				document.getElementsByClassName("prev")[i].href = menuLinks[currentPos-1].href;
			}
		}
		else{
			// hide prev link on first page
			classAmendStyle("prev", "none");
		}

		if(currentPos != len-1){
			for (var i=0; i < nextCount; i++){
				document.getElementsByClassName("next")[i].href = menuLinks[currentPos+1].href;
			}
		}
		else{
			// hide next link on last page
			classAmendStyle("next", "none");
		}
	}
	
	if(localStorage){	
		if(localStorage["progressData"]){
		// Retrieve data
			var progData = JSON.parse(localStorage["progressData"]);
			document.getElementById("progress").innerHTML = "My Progress: <strong>" + progData[2] + "</strong>";
			document.getElementById("progress").style.visibility = "visible";
			//alert(progData[2]);
		}
	}

});


function saveProgress(){
	if(localStorage){	
		//get course code (from meta description) - used in load and save progress
		var courseCode = document.head.querySelector("[name=description]").content;
		var thisUrl = window.location.href;
		var pgTitle = document.getElementsByTagName("h1")[0].innerHTML;
		var progressData = new Array();
		progressData[0] = courseCode;
		progressData[1] = thisUrl;
		progressData[2] = pgTitle;
		// Store data
		localStorage["progressData"] = JSON.stringify(progressData);
		document.getElementById("progress").style.visibility = "visible";
		document.getElementById("progress").innerHTML = "My Progress: <strong>" + progressData[2] + "</strong>";
	}
}

function loadProgress(){
	if(localStorage){	
		if(localStorage["progressData"]){
			// Retrieve data
			var prog = JSON.parse(localStorage["progressData"]);
			window.location.replace(prog[1]);
		}
		else{
			document.getElementById("progress").innerHTML = "No progress data available";
			document.getElementById("progress").style.visibility = "visible";
		}
	}
}

function clearProgress(){
	if(localStorage){	
		localStorage.clear();
		document.getElementById("progress").innerHTML = "";
		document.getElementById("progress").style.visibility = "hidden";
	}
}

function classAmendStyle(className, displayState){
    var elements = document.getElementsByClassName(className);

    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = displayState;
    }
}

