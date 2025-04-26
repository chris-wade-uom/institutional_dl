// JavaScript Document
$(function() {
	
	
	// Initialise
	var state = null;
	
	if( window.location.hash ) {
		showAllSections();
	}
	else {
		tabbify();
	}
	fixToTopOnScroll( "#tabs nav" );
	
	
	// Navigation toggle button action
	$("#navtype").click(function(){
		if( state == "tabbed" ) {
			showAllSections();
		}
		else {
			tabbify();
		}
	});
	
	
	function showAllSections() {
		// Remove behaviours from tabbed state
		if( state == "tabbed" ) {
			$("#tabs").tabs( "destroy" );
		}
		
		// Fixes conflict with fixToTop positioning
		$("#home a").attr("href", "#");
		
		// Adjust section padding to suit view
		var paddingTop = parseInt($("section").first().css("padding-top"));
		$("section:not(:first)").css("padding-top", paddingTop + 25 + "px" );

		
		// Update states
		$("#navtype").html('Show tabbed sections');
		state = "showall";
		
		// Set event to highlight selected section
		$("#tabs nav a").click(function(){
			$("#tabs nav li").removeClass("ui-state-active");
			$(this).parent().addClass("ui-state-active");
		});
		
		// Set default selected section
		var selectedSection = window.location.hash ? window.location.hash : "#home";
		$("#tabs nav li a[href*='" + selectedSection + "']").parent().addClass("ui-state-active");
		
	}
	
	function tabbify() {
		// Remove behaviours from showall state
		if( state == "showall" ) {
			$("#tabs nav a").unbind("click");
			$("#tabs nav li").removeClass("ui-state-active");
		}
		
		// Restores correct anchor
		$("#home a").attr("href", "#about");
		
		$("#tabs").tabs({ 
			active: 0 
		}); 
		
		// Adjust section padding to suit view
		var paddingTop = parseInt($("section").first().css("padding-top"));
		$("section:not(:first)").css("padding-top", paddingTop - 25 + "px" );


			
		// Update states
		$("#navtype").html('Show all sections');
		state = "tabbed";
	}
	
	
	
	function fixToTopOnScroll( element ) {
		// Stick the #nav to the top of the window
		var nav = $( element );
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
});