(function(){

	var debug = true;
	var noProgrammaticScrollingEver = false;
	var enabled = true;

	if (typeof dsj_events != 'undefined') {
		dsj_events('create', 'UA-78286573-1', 'auto');
		dsj_events('set', 'page', 'extension.instance');
		dsj_events('set', 'title', 'extension instance');
	}

	function dsj_event(action){
		if (typeof dsj_events != 'undefined') {
			dsj_events('send', 'event', 'extension', action);
		}
	}

	function dsj_event_detail(action, label, value){
		if (typeof dsj_events != 'undefined') {
			dsj_events('send', 'event', 'extension', action, label, value);
		}
	}

	function dsj_exception(err){
		if (typeof dsj_events != 'undefined') {
			dsj_events('send', 'exception', {
				'exDescription': 'initialisation error: '+err.message,
				'exFatal': false
			});
		}
	}

	document.addEventListener('initScrollJackerPreventer', function(e){
		var settings = e.detail;
		try {
			init(settings);

			var levels = ['off', 'medium', 'strict'];
			dsj_event_detail('initialised', 'strictness', levels.indexOf(settings.strictness));
			if (settings.debug){
				dsj_event_detail('initialised', 'debug', 1);
			}
		} catch (err) {
			dsj_exception(err);
		}
	});

	dsj_event('injected');

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

	function init(settings){
		
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