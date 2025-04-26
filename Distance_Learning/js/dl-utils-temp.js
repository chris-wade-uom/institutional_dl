// JavaScript Document	

// global vars

// get current url without any #
var thisUrl = window.location.href.split('#')[0];
var pathArray = window.location.pathname.split( '/' );
var pgTitle;
var progressData = new Array();

// get course code from BB url (e.g. I3027-EEEN-71376-1171-NOV-039011) - used in load and save progress
var courseCode = pathArray[3];

var anchorName;

jQuery(document).ready(function($){
	
	pgTitle = document.getElementsByTagName("h1")[0].innerHTML;

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
		//console.log("first = " + document.getElementById("contents-list").firstChild);

		for(var i=0; i < $lis.length; i++){
			
			//console.log(document.getElementById("contents-list").firstChild);

			hRef = $('ol#contents-list li a:eq(' + i + ')').attr('href');
			hRef = hRef.substring(hRef.indexOf("#") + 1);
			listTitle = $lis[i].getElementsByTagName('a')[0].innerHTML;

			if(document.getElementById(hRef)){
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
		
		// get current section in page - used for saving progress in long pages with in-page anchors
		// cache selectors
		var topMenu = $("#contents-list"),
			topMenuHeight = topMenu.outerHeight()+15,
			// All list items
			menuItems = topMenu.find("a"),
			// Anchors corresponding to menu items
			scrollItems = menuItems.map(function(){
			  var item = $($(this).attr("href"));
			  if (item.length) { return item; }
			});

		
		// bind to scroll
		$(window).scroll(function(){
			// Get container scroll position
			var fromTop = $(this).scrollTop()+topMenuHeight;
			// Get id of current scroll item
			var cur = scrollItems.map(function(){
			 if ($(this).offset().top < fromTop)
			   return this;
			});
			// Get the id of the current element
			cur = cur[cur.length-1];
			anchorName = cur && cur.length ? cur[0].id : "";
			//console.log(anchorName);
		});
	}
	
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
			};
		}
	}
	
	// create links for prev and next buttons from menu structure

	if(document.getElementById("main-menu")){
		var htmlCollection = document.getElementById("main-menu").getElementsByTagName('a');	
		var menuLinks = Array.prototype.slice.call(htmlCollection);
		console.log(menuLinks);
		var len = menuLinks.length;
		
		console.log("length = " + len);
		//console.log(JSON.stringify(menuLinks));
		for(var i=0; i<len; i++){
			//console.log("link " + i + " = " + menuLinks[i].href);
			if(menuLinks[i].getAttribute("href")==""){
				// remove item from array
				menuLinks.splice(i, 1);
				
			}
		}	
		len = menuLinks.length;
		console.log("length = " + len);
		
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
			// hide prev link
			classAmendStyle("prev", "none");
		}
		if(currentPos != len-1){
			for (var i=0; i < nextCount; i++){
				document.getElementsByClassName("next")[i].href = menuLinks[currentPos+1].href;
			}
		}
		else{
			// hide next link 
			classAmendStyle("next", "none");
		}
	}
	
	// display saved progress location 
	if(localStorage){	
		if(localStorage[courseCode]){
		// Retrieve data
			progressData = JSON.parse(localStorage[courseCode]);
			if(progressData[2]){
				document.getElementById("progress").innerHTML = "My Saved Progress: <strong><a href='" + progressData[1] + "'>" + progressData[2] + "</a></strong>";
			}
			else{
				document.getElementById("progress").innerHTML = "My Saved Progress: <strong>No progress data available</strong>";
			}	
		}
		else{
			document.getElementById("progress").innerHTML = "My Saved Progress: <strong>No progress data available</strong>";
		}
	}
	
	// scroll to in page #anchor - offset by 160px so sticky menu doesn't hide the anchor
	$(function() {
		$('a[href*=#]:not([href=#])').click(function() {
			if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				//console.log("target = " + target);
				if (target.length) {
						$('html,body').animate({
						scrollTop: target.offset().top - 160 //offsets for fixed header
						}, 1000);
					return false;
				}
			}
		});
		//Executed on page load with URL containing an anchor tag.
		if($(location.href.split("#")[1])) {
			var target = $('#'+location.href.split("#")[1]);
			//console.log(target);
			if (target.length) {
				$('html,body').animate({
					scrollTop: target.offset().top - 160 //offset height of header here too.
				}, 1000);
				return false;
			}
		}
	});
	
});


function saveProgress(){
	if(localStorage){	
		// if ToC menu exists (for long pages)
		if(document.getElementById("contents-list") && anchorName){
			progressData[0] = courseCode;
			progressData[1] = thisUrl + "#" + anchorName;
			progressData[2] = document.getElementById(anchorName).innerHTML;
		}
		else{
			progressData[0] = courseCode;
			progressData[1] = thisUrl;
			progressData[2] = pgTitle;
		}
		// Store data
		localStorage.setItem(courseCode, JSON.stringify(progressData));
		document.getElementById("progress").innerHTML = "My Saved Progress: <strong>" + progressData[2] + "</strong>";		
	}
	return false;
}

function loadProgress(){
	if(localStorage){	
		if(localStorage[courseCode]){
			// Retrieve data
			var prog = JSON.parse(localStorage[courseCode]);
			if(!prog[1]){
				document.getElementById("progress").innerHTML = "My Saved Progress: <strong>No progress data available</strong>";
			}
			else{
				if(document.getElementById("contents-list")){
					window.location.replace(prog[1]);
					if(prog[1]==window.location.href || prog[1]==thisUrl){
						window.location.reload();
					}		
				}
				else{
					window.location.replace(prog[1]);
				}
			}
		}
		else{
			document.getElementById("progress").innerHTML = "My Saved Progress: <strong>No progress data available</strong>";
		}
	}
	return false;
}

function clearProgress(){
	if(localStorage){
		if(localStorage[courseCode]){
		   	localStorage.removeItem(courseCode);
			document.getElementById("progress").innerHTML = "My Saved Progress: <strong>No progress data available</strong>";
		}
	}
	return false;
}

function classAmendStyle(className, displayState){
    var elements = document.getElementsByClassName(className);

    for (var i = 0; i < elements.length; i++){
        elements[i].style.display = displayState;
    }
}

