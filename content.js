// Initialize styles when content script loads
chrome.runtime.sendMessage({action: "getState"}, function(response) {
  updateFocusMode(response?.enabled || false);
});

// Listen for messages to update focus mode
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "updateFocusMode") {
    updateFocusMode(request.enabled);
    sendResponse({success: true});
  }
  return true;
});

// Function to update the visibility of distracting elements
function updateFocusMode(enabled) {
  const style = document.createElement('style');
  style.id = 'focus-extension-style';
  
  if (enabled) {
    // Hide the targeted elements
    style.textContent = `
      .html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles {
        display: none !important;
      }
      #secondary.style-scope.ytd-watch-flexy {
        display: none !important;
      }
    `;
    
    // Remove existing style if it exists
    const existingStyle = document.getElementById('focus-extension-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    
    document.head.appendChild(style);
  } else {
    // Remove the style to show elements again
    const existingStyle = document.getElementById('focus-extension-style');
    if (existingStyle) {
      existingStyle.remove();
    }
  }
}

// Handle potential YouTube SPA (Single Page Application) navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    chrome.runtime.sendMessage({action: "getState"}, function(response) {
      updateFocusMode(response?.enabled || false);
    });
  }
}).observe(document, {subtree: true, childList: true});