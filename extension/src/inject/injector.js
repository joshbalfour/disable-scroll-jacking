function injectScript(file, node) {
	var th = document.getElementsByTagName(node)[0];
	var s = document.createElement('script');
	s.setAttribute('type', 'text/javascript');
	s.setAttribute('src', file);
	th.appendChild(s);
}

function runFunctionInPageContext(fn) {
	var script = document.createElement('script');
	script.textContent = fn.toString();
	document.documentElement.appendChild(script);
	document.documentElement.removeChild(script);
}

injectScript( chrome.extension.getURL('/src/inject/injected.js'), 'head');

chrome.storage.sync.get({
	strictness: 'medium',
	debug: false,
	tracking: true
}, function(settings){
	var event = new CustomEvent('initScrollJackerPreventer', { detail: settings });
	setTimeout(function(){
		document.dispatchEvent(event);
	}, 10);
});

document.addEventListener("dsj_event",function(e){
	var data = e.detail;
	console.log(data);
});