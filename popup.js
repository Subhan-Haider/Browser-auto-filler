const sendMessageToTab = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs || tabs.length === 0) return;
        
        const currentTab = tabs[0];
        if (currentTab.url && (currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('edge://') || currentTab.url.includes('chrome.google.com'))) {
            alert("Bypass Pro: Extensions are disabled by Chrome on this specific page. Open a normal website first!");
            return;
        }

        chrome.tabs.sendMessage(currentTab.id, { action: action }, (response) => {
            if (chrome.runtime.lastError) {
                // The content script isn't loaded on this tab yet!
                alert("Bypass Pro: Please RELOAD this page first! The extension was just installed/updated and needs a page refresh to inject its scripts.");
            } else {
                window.close(); // Success, close popup
            }
        });
    });
};

document.getElementById('zapMode').addEventListener('click', () => sendMessageToTab('enableZapMode'));
document.getElementById('autoFill').addEventListener('click', () => sendMessageToTab('autoFill'));
document.getElementById('bypassVerify').addEventListener('click', () => sendMessageToTab('bypassVerify'));

// Auto bypass toggle logic
document.getElementById('autoBypass').addEventListener('change', (e) => {
    chrome.storage.local.set({ autoBypass: e.target.checked });
});

chrome.storage.local.get(['autoBypass'], (result) => {
    if (result.autoBypass !== undefined) {
        document.getElementById('autoBypass').checked = result.autoBypass;
    }
});
