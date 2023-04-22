import * as content from "./content.js"

// Add an event listener to detect when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    // Check if the URL of the updated tab matches the Gmail email URL pattern
    if (changeInfo.status === 'complete' && tab.url && tab.url.match(/^https:\/\/mail\.google\.com\/mail\/u\/\d\/.*\/#inbox\/.*/)) {
        // Retrieve the email ID from the URL of the active tab
        var emailId = getEmailIdFromUrl(tab.url);
        // Call your function to retrieve the email data
        getEmailData(emailId);
    }
});

// Function to retrieve the email ID from a Gmail email URL
function getEmailIdFromUrl(url) {
    var match = url.match(/#inbox\/(.*)/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}