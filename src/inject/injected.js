(function(){

	var debug = true;
	var noProgrammaticScrollingEver = false;
	var enabled = true;

	document.addEventListener('initScrollJackerPreventer', function(e){
		var settings = e.detail;
		debug = settings.debug;
		switch (settings.strictness){
			case "strict":
				noProgrammaticScrollingEver = true;
				break;
			case "medium":
				break;
			case "off":
				enabled = false;
				break;
		}
		init();
	});

	var eventBlacklist = [
		"mousemove",
		"scroll",
		"mousewheel",
		"DOMMouseScroll",
		"DomMouseScroll",
		"MozMousePixelScroll",
		"wheel",
		"hashchange"
	];

	var windowFunctionsToWrap = [
		"scrollTo",
		"scroll",
		"scrollBy"
	];

	var noProgrammaticScrolling = false;

	function wrapBlacklistedEventsFromElement(ele, $){
		
		var wrapEventHandler = function(event){

			return function (e){
				noProgrammaticScrolling = true;
				event.handler(e);
				if (!noProgrammaticScrollingEver){
					noProgrammaticScrolling = false;
				}
			};
			
		};

		var events = $._data( ele, "events" );

		for (var eventName in events){
			if (eventBlacklist.indexOf(eventName) != -1){
				
				var newEventHandlers = events[eventName].map(wrapEventHandler);
				$(ele).off(eventName);

				for (var i in newEventHandlers){
					$(ele).on(eventName, newEventHandlers[i]);
				}

			}
		}
	}

	function wrap(original){
		return function(){
			if (!noProgrammaticScrolling){
				original.apply(window, arguments);
			} else {
				if (debug){
					console.log("Blocked wrapped function as programmatic scrolling is disabled");
				}
			}
		};
	}

	function wrapWindowFunction(name){
		window[name] = wrap(window[name]);
	}

	function init(){
	
		if (enabled){

			if (typeof jQuery != 'undefined'){
				var $ = jQuery;
				$.fn.scrollTo = wrap($.fn.scrollTo);
				wrapBlacklistedEventsFromElement(window, $);
				wrapBlacklistedEventsFromElement(document, $);
				wrapBlacklistedEventsFromElement(document.body, $);
			}

			windowFunctionsToWrap.forEach(wrapWindowFunction);

		}

	}


})();