try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "ee0a71d5-3f72-4b74-b8b3-93b0f24bb7fc", e._sentryDebugIdIdentifier = "sentry-dbid-ee0a71d5-3f72-4b74-b8b3-93b0f24bb7fc");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Salvează ca",
  "jumplist.openCompanionWindowDisplayName": "Deschide fereastra însoțitoare",
  "jumplist.quitDisplayName": "Ieși din ChatGPT",
  "jumplist.reloadDisplayName": "Reîncarcă",
  "loadError.description": "Verifică setările de rețea și încearcă să repornești ChatGPT.",
  "loadError.reloadButton": "Repornește ChatGPT",
  "loadError.summary": "ChatGPT nu se poate încărca",
  "trayMenu.copyAppInfo": "Copiază informațiile despre aplicație: {summary}",
  "trayMenu.logout": "Deconectează-te",
  "trayMenu.openCompanionWindow": "Deschide fereastra însoțitoare",
  "trayMenu.openMainWindow": "Deschide fereastra ChatGPT",
  "trayMenu.quit": "Ieși",
  "trayMenu.reload": "Reîncarcă",
  "webContextMenu.addToDictionary": "Adaugă în dicționar",
  "webContextMenu.copyImage": "Copiază imaginea",
  "webContextMenu.copyLink": "Copiază linkul",
  "webContextMenu.copyText": "Copiază",
  "webContextMenu.cutText": "Decupează",
  "webContextMenu.pasteText": "Lipește",
  "webContextMenu.saveImageAs": "Salvează imaginea ca",
  "webContextMenu.selectAll": "Selectează tot",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Anulează"
};
export {
  n as default
};
