define(["modules/jquery-mozu","shim!vendor/classie"],
function ($,classie) {
(function() {
	var triggerBttn = document.getElementById( 'jb-mobile-menu' ),
		overlay = document.querySelector( 'div.jb-custom-overlay' ),
		closeBttn = overlay.querySelector( '.menu-close-btn' ),
		documentElement = document.querySelector('body');
	var	transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
	
        transEndEventName = transEndEventNames.transition,		
        
		support = { transitions : Modernizr.csstransitions };

	function toggleOverlay() {
		if( classie.has( overlay, 'open' ) ) {
			classie.remove( overlay, 'open' );
			classie.add( overlay, 'close' );
			var onEndTransitionFn = function( ev ) {
				if( support.transitions ) {
					if( ev.propertyName !== 'visibility' ) return;
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				classie.remove( overlay, 'close' );
			};
			if( support.transitions ) {
				overlay.addEventListener( transEndEventName, onEndTransitionFn );
			}
			else {
				onEndTransitionFn();
			}
			classie.remove(documentElement, 'jb-modal-window');
		}
		else if( !classie.has( overlay, 'close' ) ) {
			classie.add( overlay, 'open' );
			classie.add(documentElement, 'jb-modal-window');
		}
	}
	if(triggerBttn) triggerBttn.addEventListener( 'click', toggleOverlay );
	if(closeBttn) closeBttn.addEventListener( 'click', toggleOverlay );
})();



});

