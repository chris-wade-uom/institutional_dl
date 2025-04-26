// JavaScript Document

/* Note:
 * Commmented out configuration instructions relate the support for responsive rendering and accessibility enhancements.
 * These extensions are due to be build into a future version of MathJax. 
 * To avoid a potention conflict once these extension do make it into a standard release, the settings
 * are commented out for now.
 * For more details see: https://www.mathjax.org/mathjax-accessibility-extensions-v1-now-available/
 */ 
window.MathJax = {
	
	AuthorInit: function () {
		//MathJax.Ajax.config.path["Contrib"] = "https://cdn.mathjax.org/mathjax/contrib";
		
		MathJax.Hub.Register.StartupHook("Begin",function () {
			MathJax.Hub.Queue(function () {
				// Force Blackboard to recalculate iframe size after MathJax has rendered
				if(parent.page) { parent.page.setIframeHeightAndWidth(); }
			})
		});
    },
	//extensions: ["[Contrib]/a11y/accessibility-menu.js"],
	
	tex2jax: 			{inlineMath: [['$','$']]},
	processEscapes: 	true,
	// Force linebreaks for smaller device screens
	CommonHTML: 		{ linebreaks: { automatic: true } },
  	"HTML-CSS": 		{ linebreaks: { automatic: true } },
    SVG: 				{ linebreaks: { automatic: true } },
	TeX: 				{ equationNumbers: { autoNumber: "AMS" },
						  Macros: { gammaA: '{\\gamma_a}' } },
						  
	menuSettings: 		{ 
		zoom: "Double-Click", 
		//collapsible: true, // Responsive setting for small screen devices
		//autocollapse: true, // Responsive setting for small screen devices
		//explorer: true // Responsive setting for small screen devices
	}
};

