try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "7d4f57af-877a-4e86-99d0-f0b48c91fb18", e._sentryDebugIdIdentifier = "sentry-dbid-7d4f57af-877a-4e86-99d0-f0b48c91fb18");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Desa com a",
  "jumplist.openCompanionWindowDisplayName": "Obre finestra d'assistència",
  "jumplist.quitDisplayName": "Sortir de ChatGPT",
  "jumplist.reloadDisplayName": "Torna a carregar",
  "loadError.description": "Comprova la configuració de la xarxa i intenta reiniciar ChatGPT.",
  "loadError.reloadButton": "Reinicia ChatGPT",
  "loadError.summary": "ChatGPT no es pot carregar",
  "trayMenu.copyAppInfo": "Copia la informació de l'app: {summary}",
  "trayMenu.logout": "Tanca la sessió",
  "trayMenu.openCompanionWindow": "Obre finestra d'assistència",
  "trayMenu.openMainWindow": "Obre una finestra de ChatGPT",
  "trayMenu.quit": "Surt",
  "trayMenu.reload": "Torna a carregar",
  "webContextMenu.addToDictionary": "Afegeix al diccionari",
  "webContextMenu.copyImage": "Copia la imatge",
  "webContextMenu.copyLink": "Copia l'enllaç",
  "webContextMenu.copyText": "Copia",
  "webContextMenu.cutText": "Talla",
  "webContextMenu.pasteText": "Enganxa",
  "webContextMenu.saveImageAs": "Desa la imatge com a",
  "webContextMenu.selectAll": "Selecciona-ho tot",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Desfés"
};
export {
  n as default
};
