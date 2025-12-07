try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, t = new e.Error().stack;
    t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "5c2a5255-2667-4733-a077-355a3b4290e9", e._sentryDebugIdIdentifier = "sentry-dbid-5c2a5255-2667-4733-a077-355a3b4290e9");
  })();
} catch {
}
const o = {
  "downloadManager.saveAsDialogTitle": { defaultMessage: "Save As", description: "Title for system 'Save As' dialogs that appear when downloading images or files" },
  "jumplist.openCompanionWindowDisplayName": { defaultMessage: "Open companion window", description: "Taskbar icon context menu item to open the ChatGPT companion window" },
  "jumplist.quitDisplayName": { defaultMessage: "Quit ChatGPT", description: "Taskbar icon context menu item to quit the app" },
  "jumplist.reloadDisplayName": { defaultMessage: "Reload", description: "Taskbar icon context menu item to reload the app" },
  "loadError.description": { defaultMessage: "Check your network settings and try restarting ChatGPT.", description: "Instructions on error page that appears when ChatGPT fails to load due to network errors, software crash, etc." },
  "loadError.reloadButton": { defaultMessage: "Restart ChatGPT", description: "Text of button on error screen that initiates an application reload attempt" },
  "loadError.summary": { defaultMessage: "ChatGPT is unable to load", description: "Title of error page when ChatGPT fails to load due to network errors, software crash, etc." },
  "trayMenu.copyAppInfo": { defaultMessage: "Copy app info: {summary}", description: "System Tray menu item to copy application information to clipboard" },
  "trayMenu.logout": { defaultMessage: "Log out", description: "System Tray menu item to logout of the app" },
  "trayMenu.openCompanionWindow": { defaultMessage: "Open companion window", description: "System Tray menu item to open application's companion window" },
  "trayMenu.openMainWindow": { defaultMessage: "Open ChatGPT window", description: "System Tray menu item to open main application Window" },
  "trayMenu.quit": { defaultMessage: "Quit", description: "System Tray menu item to quit application" },
  "trayMenu.reload": { defaultMessage: "Reload", description: "System Tray menu item to reload the app" },
  "webContextMenu.addToDictionary": { defaultMessage: "Add to dictionary", description: "Web Contents context menu item to add a misspelled word to the spell checker dictionary" },
  "webContextMenu.copyImage": { defaultMessage: "Copy image", description: "Web Contents context menu item to copy image at specified position to system clipboard" },
  "webContextMenu.copyLink": { defaultMessage: "Copy link", description: "Web Contents context menu item to copy link url target to system clipboard" },
  "webContextMenu.copyText": { defaultMessage: "Copy", description: "Web Contents context menu item to copy text to system clipboard" },
  "webContextMenu.cutText": { defaultMessage: "Cut", description: "Web Contents context menu item to cut editable text and put it on system clipboard" },
  "webContextMenu.pasteText": { defaultMessage: "Paste", description: "Web Contents context menu item to paste text from system clipboard" },
  "webContextMenu.saveImageAs": { defaultMessage: "Save image as", description: "Web Contents context menu item to download image at specified position to a local file" },
  "webContextMenu.selectAll": { defaultMessage: "Select all", description: "Web Contents context menu item to select all text in current editable area" },
  "webContextMenu.showEmoji": { defaultMessage: "Emoji", description: "Web Contents context menu item to show emoji picker panel" },
  "webContextMenu.undoEdit": { defaultMessage: "Undo", description: "Web Contents context menu item to undo last text edit action" }
};
export {
  o as default
};
