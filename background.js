// Initialize state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ focusModeEnabled: false });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getState") {
    chrome.storage.local.get("focusModeEnabled", (data) => {
      sendResponse({ enabled: data.focusModeEnabled || false });
    });
    return true; // Required for async sendResponse
  } else if (request.action === "toggleFocus") {
    chrome.storage.local.get("focusModeEnabled", (data) => {
      const newState = !data.focusModeEnabled;
      chrome.storage.local.set({ focusModeEnabled: newState });
      
      // Send message to content script if on YouTube
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes("youtube.com")) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: "updateFocusMode", 
            enabled: newState 
          }).catch(() => {
            // Handle error if content script isn't ready
            console.log("Content script not ready, injecting it");
            chrome.scripting.executeScript({
              target: { tabId: tabs[0].id },
              files: ["content.js"]
            });
          });
        }
      });
      
      sendResponse({ enabled: newState });
    });
    return true; // Required for async sendResponse
  }
});