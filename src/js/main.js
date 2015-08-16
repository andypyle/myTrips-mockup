/// Require components for Browserify.

window.jQuery = window.$ = require('../components/jquery/dist/jquery.js');
require('../components/velocity/velocity.js');
require('../components/velocity/velocity.ui.js');


/// Document ready.

$(document).ready(function(){
	var toggleNav = $('header').find('.toggleNav a');
	var navPanel = $('header').find('nav');

	
	/// If toggleNav is visible(only on small devices), bind a click event to it.
	if(toggleNav.is(':visible')){
		navPanel.hide();
		toggleNav.on('click', function(e){
			e.preventDefault();
			if(navPanel.is(':hidden')){
				navPanel.velocity({
					translateX: '0'
				},{display:'flex'});
			} else {
				navPanel.velocity({
					translateX: '-100%'
				},{display:'none'});
			}
		});
	}

	
});