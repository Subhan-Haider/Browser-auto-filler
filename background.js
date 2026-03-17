chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "zapElement",
    title: "Zap this element",
    contexts: ["all"]
  });
  
  // Initialize storage
  chrome.storage.local.set({ autoBypass: true });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "zapElement") {
    chrome.tabs.sendMessage(tab.id, { action: "enableZapMode" });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "activate-zap") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "enableZapMode" });
    });
  }
});
