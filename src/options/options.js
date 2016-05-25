
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
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);