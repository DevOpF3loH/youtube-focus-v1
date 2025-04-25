document.addEventListener('DOMContentLoaded', function() {
  const toggleButton = document.getElementById('toggleFocus');
  const statusText = document.getElementById('status');
  
  // Check current state from storage
  chrome.runtime.sendMessage({action: "getState"}, function(response) {
    updateUI(response?.enabled || false);
  });
  
  // Toggle focus mode
  toggleButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "toggleFocus"}, function(response) {
      updateUI(response?.enabled || false);
    });
  });
  
  // Update UI based on state
  function updateUI(enabled) {
    if (enabled) {
      toggleButton.textContent = 'Disable Focus Mode';
      statusText.textContent = 'Currently: Enabled';
    } else {
      toggleButton.textContent = 'Enable Focus Mode';
      statusText.textContent = 'Currently: Disabled';
    }
  }
});