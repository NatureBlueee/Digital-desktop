try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "d0ef749c-896c-4599-b351-4270a7045446", e._sentryDebugIdIdentifier = "sentry-dbid-d0ef749c-896c-4599-b351-4270a7045446");
  })();
} catch {
}
const o = {
  "downloadManager.saveAsDialogTitle": "Opslaan als",
  "jumplist.openCompanionWindowDisplayName": "Begeleidend venster openen",
  "jumplist.quitDisplayName": "ChatGPT afsluiten",
  "jumplist.reloadDisplayName": "Opnieuw laden",
  "loadError.description": "Controleer je netwerkinstellingen en start ChatGPT opnieuw op.",
  "loadError.reloadButton": "ChatGPT opnieuw opstarten",
  "loadError.summary": "ChatGPT kan niet worden geladen",
  "trayMenu.copyAppInfo": "App-info kopiëren: {summary}",
  "trayMenu.logout": "Afmelden",
  "trayMenu.openCompanionWindow": "Begeleidend venster openen",
  "trayMenu.openMainWindow": "ChatGPT-venster openen",
  "trayMenu.quit": "Afsluiten",
  "trayMenu.reload": "Opnieuw laden",
  "webContextMenu.addToDictionary": "Aan woordenboek toevoegen",
  "webContextMenu.copyImage": "Afbeelding kopiëren",
  "webContextMenu.copyLink": "Link kopiëren",
  "webContextMenu.copyText": "Kopiëren",
  "webContextMenu.cutText": "Knippen",
  "webContextMenu.pasteText": "Plakken",
  "webContextMenu.saveImageAs": "Afbeelding opslaan als",
  "webContextMenu.selectAll": "Alles selecteren",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Ongedaan maken"
};
export {
  o as default
};
