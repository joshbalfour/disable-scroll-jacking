function injectScript(file, node) {
	var th = document.getElementsByTagName(node)[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	th.appendChild(s);
}

injectScript( chrome.extension.getURL('/src/inject/injected.js'), 'head');

chrome.storage.sync.get({
	strictness: 'medium',
	debug: false
}, function(settings){
	var event = new CustomEvent('initScrollJackerPreventer', { detail: settings });
	setTimeout(function(){
		document.dispatchEvent(event);
	}, 200);
	
});