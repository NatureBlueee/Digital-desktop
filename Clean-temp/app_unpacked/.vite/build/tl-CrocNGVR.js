try {
  (function() {
    var a = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new a.Error().stack;
    n && (a._sentryDebugIds = a._sentryDebugIds || {}, a._sentryDebugIds[n] = "88abc4ae-02aa-4c19-8dfd-7595bffbf6ee", a._sentryDebugIdIdentifier = "sentry-dbid-88abc4ae-02aa-4c19-8dfd-7595bffbf6ee");
  })();
} catch {
}
const e = {
  "downloadManager.saveAsDialogTitle": "I-save Bilang",
  "jumplist.openCompanionWindowDisplayName": "Buksan sa companion window",
  "jumplist.quitDisplayName": "Mag-quit sa ChatGPT",
  "jumplist.reloadDisplayName": "I-reload",
  "loadError.description": "Tingnan ang mga setting ng iyong network at subukang i-restart ang ChatGPT.",
  "loadError.reloadButton": "I-restart ang ChatGPT",
  "loadError.summary": "Hindi mai-load ang ChatGPT",
  "trayMenu.copyAppInfo": "Kopyahin ang impormasyon ng app: {summary}",
  "trayMenu.logout": "Mag-log out",
  "trayMenu.openCompanionWindow": "Buksan sa companion window",
  "trayMenu.openMainWindow": "Buksan ang ChatGPT window",
  "trayMenu.quit": "Mag-quit",
  "trayMenu.reload": "I-reload",
  "webContextMenu.addToDictionary": "Idagdag sa diksyunaryo",
  "webContextMenu.copyImage": "Kopyahin ang larawan",
  "webContextMenu.copyLink": "Kopyahin ang link",
  "webContextMenu.copyText": "Kopyahin",
  "webContextMenu.cutText": "I-cut",
  "webContextMenu.pasteText": "I-paste",
  "webContextMenu.saveImageAs": "I-save ang larawan bilang",
  "webContextMenu.selectAll": "Piliin ang lahat",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "I-undo"
};
export {
  e as default
};
