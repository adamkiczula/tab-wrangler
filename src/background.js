var windows = JSON.parse(localStorage.windows);
var windowIds = {};
var mainWindowId = null;

if (mainWindowId === null) {
    chrome.windows.getCurrent(function(win) {
        mainWindowId = win.id;
    });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (changeInfo.url && changeInfo.url !== "chrome://newtab/") {
        var matched = false;
        for (var i=0; i<windows.length; i++) {
            pattern = new RegExp(windows[i]);
            if (changeInfo.url.match(pattern)) {
                matched = true;
                if (typeof(windowIds[windows[i]]) === "undefined") {
                    // create new window
                    chrome.windows.create({"tabId": tabId, "focused": true}, function(win){
                        windowIds[windows[i]] = win.id;
                    });
                } else {
                    chrome.tabs.move(tabId, {"windowId": windowIds[windows[i]], "index": -1});
                    chrome.tabs.update(tabId, {"selected": true});
                    chrome.windows.update(windowIds[windows[i]], {"focused": true});
                }
                return;
            }
        }
        if (!matched && isWindowManaged(tab.windowId)) {
            // open in the main window
            chrome.tabs.move(tabId, {"windowId": mainWindowId, "index": -1});
            chrome.tabs.update(tabId, {"selected": true});
            chrome.windows.update(mainWindowId, {"focused": true});
        }
    }
});

function isWindowManaged(windowId) {
    var managed = false;
    for (x in windowIds) {
        if (windowIds[x] === windowId) {
            managed = true;
            break;
        }
    }
    return managed;
}
