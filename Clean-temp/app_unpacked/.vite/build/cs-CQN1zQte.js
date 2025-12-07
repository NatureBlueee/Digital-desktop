try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, o = new e.Error().stack;
    o && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[o] = "10b654c5-3de8-400c-b530-5ce7c17a561b", e._sentryDebugIdIdentifier = "sentry-dbid-10b654c5-3de8-400c-b530-5ce7c17a561b");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Uložit jako",
  "jumplist.openCompanionWindowDisplayName": "Otevřít doprovodné okno",
  "jumplist.quitDisplayName": "Ukončit ChatGPT",
  "jumplist.reloadDisplayName": "Znovu načíst",
  "loadError.description": "Zkontroluj nastavení sítě a zkus restartovat ChatGPT.",
  "loadError.reloadButton": "Restartovat ChatGPT",
  "loadError.summary": "ChatGPT nelze načíst",
  "trayMenu.copyAppInfo": "Zkopírovat informace o aplikaci: {summary}",
  "trayMenu.logout": "Odhlásit se",
  "trayMenu.openCompanionWindow": "Otevřít doprovodné okno",
  "trayMenu.openMainWindow": "Otevřít okno ChatGPT",
  "trayMenu.quit": "Ukončit",
  "trayMenu.reload": "Znovu načíst",
  "webContextMenu.addToDictionary": "Přidat do slovníku",
  "webContextMenu.copyImage": "Zkopírovat obrázek",
  "webContextMenu.copyLink": "Zkopírovat odkaz",
  "webContextMenu.copyText": "Zkopírovat",
  "webContextMenu.cutText": "Vyjmout",
  "webContextMenu.pasteText": "Vložit",
  "webContextMenu.saveImageAs": "Uložit obrázek jako",
  "webContextMenu.selectAll": "Vybrat vše",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Vrátit zpět"
};
export {
  t as default
};
