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


function initEvents(){
	runFunctionInPageContext(
		[
			"(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){",
			"(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o);",
			"a.async=1;a.src=g;document.documentElement.appendChild(a)",
			"})(window,document,'script','"+chrome.extension.getURL('/src/vendor/analytics.js')+"','dsj_events');"
		].join('')
	);
}

injectScript( chrome.extension.getURL('/src/inject/injected.js'), 'head');

chrome.storage.sync.get({
	strictness: 'medium',
	debug: false,
	tracking: true
}, function(settings){
	if (settings.tracking){
		initEvents();
	}
	var event = new CustomEvent('initScrollJackerPreventer', { detail: settings });
	setTimeout(function(){
		document.dispatchEvent(event);
	}, 10);
});

document.addEventListener("dsj_event",function(e){
	var data = e.detail;
	console.log(data);
});