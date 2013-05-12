// show welcome message
console.log("Welcome, curious developer!\nFor questions or feedback: http://twitter.com/sican.\nMy portfolio: http://sicanstudios.com.\nCreated by Alex Cican, in 2013.")

// browsers specific adjustments
var ipad = navigator.userAgent.match(/iPad/i) != null,
    iphone = navigator.userAgent.match(/iPhone/i) != null,
    firefox = navigator.userAgent.match(/Firefox/i) != null,
    windows = navigator.userAgent.match(/Windows/i) != null,
    width = (window.innerWidth > 0) ? window.innerWidth : screen.width,
    height = (window.innerHeight > 0) ? window.innerHeight : screen.height,
    smallScreen = false;

// checks if it's a touch device
function isTouchDevice() {  
  try {  
    document.createEvent("TouchEvent");  
    return !!('ontouchstart' in window) // works on most browsers 
      || !!('window.navigator.msMaxTouchPoints' in window); // works on ie10
  } catch (e) {  
    return false;  
  }  
}

// if touch device, calls ext. script that removes delay on clicks/taps
if (isTouchDevice()) {
  $.getScript("./js/removeclickdelay.js");
}
    
// if small screen (could be mobile, tablet, or desktop)
if (width <= "768") {
  smallScreen = true;
}

// if iPhone or iPad
if (iphone || ipad) {
  // iOS re-orientation fix
  var viewportmeta = document.querySelectorAll('meta[name="viewport"]')[0];
  if (viewportmeta) {
    viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0';
    document.body.addEventListener('gesturestart', function() {
      viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
    }, false);
  }

  // hides Safari address bar on iPhone
  window.addEventListener("load",function() {
    setTimeout(function() {
      window.scrollTo(0, 1);
    }, 300);
  });
}

// if Windows calls ext. script that fixes styling
if (windows) {
  $.getScript("./js/windows.js");
}

// if Firefox calls ext. script that fixes styling
if (firefox) {
  $.getScript("./js/firefox.js");
}