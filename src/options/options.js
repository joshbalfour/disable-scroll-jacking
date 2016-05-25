
if (document.location.hash != '#ba'){
	document.getElementById('rct').style.display='none';
} else {
	document.getElementById('rct').onclick = reportCurrentTab;
}

document.body.className = document.location.hash.split('#').join('');

function dsj_event(action){
	if (typeof dsj_events != 'undefined') {
		dsj_events('send', 'event', 'options', action);
	}
}

function dsj_event_detail(action, label, value){
	if (typeof dsj_events != 'undefined') {
		dsj_events('send', 'event', 'options', action, label, value);
	}
}

// Saves options to chrome.storage.sync.
function save_options() {
	var strictness = document.getElementById('strictness').value;
	var debug = document.getElementById('debug').checked;
	var tracking = document.getElementById('tracking').checked;

	var levels = ['off', 'medium', 'strict'];
	
	if (tracking){
		dsj_event_detail('set', 'strictness', levels.indexOf(strictness));
		dsj_event_detail('set', 'debug', debug);
	}

	chrome.storage.sync.set({
		strictness: strictness,
		debug: debug,
		tracking: tracking
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		if (settings.tracking){
			initEvents();
		}
		setTimeout(function() {
			status.textContent = '';
		}, 1250);
	});
}

var eventsCode = 'UA-78286573-1';
var eventsLoaded = false;

function initEvents(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','dsj_events');
		
		dsj_events('create', eventsCode, 'auto');
		dsj_events('set', 'checkProtocolTask', function(){});
		dsj_event('opened');
		dsj_events('set', 'page', 'extension.options');

		eventsLoaded = true;
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
	// Use default values
	chrome.storage.sync.get({
		strictness: 'medium',
		debug: false,
		tracking: true
	}, function(settings) {
		document.getElementById('strictness').value = settings.strictness;
		document.getElementById('debug').checked = settings.debug;
		document.getElementById('tracking').checked = settings.tracking;

		if (settings.tracking){
			if (!eventsLoaded){
				initEvents();
			} else {
				window['ga-disable-'+eventsCode] = false;
			}
		} else {
			window['ga-disable-'+eventsCode] = true;
		}
	});
}

function getCurrentTabUrl(callback) {

	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, function(tabs) {
		var tab = tabs[0];

		var url = tab.url;

		callback(url);
	});
}

function makeReportUrl(form){
	var object = {
		name: 'optional',
		email: 'optional@co.com',
		issue_title: 'optional',
		details: [
			'When I was: ',
			'This happened: ',
			'When what should have happened was: '
		].join(encodeURIComponent('\n\n'))
	};

	if (form){
		for (var i in form){
			object[i] = form[i];
		}
	}

	object.details += encodeURIComponent('\n \n \n')+'Debug Info: '+encodeURIComponent(navigator.userAgent);
	
	var urlParts = [];

	for (var key in object){
		urlParts.push([key,object[key]].join('='));
	}

	var reportURL = 'https://gitreports.com/issue/joshbalfour/disable-scroll-jacking?'+urlParts.join('&');
	
	return reportURL;
}

function reportCurrentTab(){
	getCurrentTabUrl(function(url){
		var reportURL = makeReportUrl({
			issue_title: url+' is stealing my scrollbar!',
			details: 'Please fill in the CAPTCHA and click submit'
		});
		window.open(reportURL);
	});
}

function reportIssue(){
	window.open(makeReportUrl());
}

document.getElementById('reportIssue').onclick = reportIssue;

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
		save_options);