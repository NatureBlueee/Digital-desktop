try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, t = new e.Error().stack;
    t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "380e047c-01e9-47fb-a1fd-1e406fa7ba6e", e._sentryDebugIdIdentifier = "sentry-dbid-380e047c-01e9-47fb-a1fd-1e406fa7ba6e");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Сачувај као",
  "jumplist.openCompanionWindowDisplayName": "Отвори пратећи прозор",
  "jumplist.quitDisplayName": "Затвори ChatGPT",
  "jumplist.reloadDisplayName": "Учитај поново",
  "loadError.description": "Провери мрежне поставке и пробај да рестартујеш ChatGPT. ",
  "loadError.reloadButton": "Restart ChatGPT",
  "loadError.summary": "ChatGPT не може да се учита",
  "trayMenu.copyAppInfo": "Копирај информације о апликацији: {summary}",
  "trayMenu.logout": "Одјави ме",
  "trayMenu.openCompanionWindow": "Отвори пратећи прозор",
  "trayMenu.openMainWindow": "Отвори прозор ChatGPT-ја",
  "trayMenu.quit": "Одустани",
  "trayMenu.reload": "Учитај поново",
  "webContextMenu.addToDictionary": "Додај у речник",
  "webContextMenu.copyImage": "Копирај слику",
  "webContextMenu.copyLink": "Копирај линк",
  "webContextMenu.copyText": "Копирај",
  "webContextMenu.cutText": "Исеци",
  "webContextMenu.pasteText": "Налепи",
  "webContextMenu.saveImageAs": "Сачувај слику као",
  "webContextMenu.selectAll": "Изабери све",
  "webContextMenu.showEmoji": "Емоџи",
  "webContextMenu.undoEdit": "Опозови"
};
export {
  n as default
};
