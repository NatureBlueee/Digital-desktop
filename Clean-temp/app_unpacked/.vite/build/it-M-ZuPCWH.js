try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "d570fa44-56bc-4c2f-8406-6bb6fa6d4d48", e._sentryDebugIdIdentifier = "sentry-dbid-d570fa44-56bc-4c2f-8406-6bb6fa6d4d48");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Salva con nome",
  "jumplist.openCompanionWindowDisplayName": "Apri finestra companion",
  "jumplist.quitDisplayName": "Esci da ChatGPT",
  "jumplist.reloadDisplayName": "Ricarica",
  "loadError.description": "Controlla le impostazioni di rete e prova a riavviare ChatGPT.",
  "loadError.reloadButton": "Riavvia ChatGPT",
  "loadError.summary": "Impossibile caricare ChatGPT",
  "trayMenu.copyAppInfo": "Copia info app: {summary}",
  "trayMenu.logout": "Esci",
  "trayMenu.openCompanionWindow": "Apri finestra companion",
  "trayMenu.openMainWindow": "Apri finestra ChatGPT",
  "trayMenu.quit": "Abbandona",
  "trayMenu.reload": "Ricarica",
  "webContextMenu.addToDictionary": "Aggiungi al dizionario",
  "webContextMenu.copyImage": "Copia immagine",
  "webContextMenu.copyLink": "Copia link",
  "webContextMenu.copyText": "Copia",
  "webContextMenu.cutText": "Taglia",
  "webContextMenu.pasteText": "Incolla",
  "webContextMenu.saveImageAs": "Salva immagine con nome",
  "webContextMenu.selectAll": "Seleziona tutto",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Annulla"
};
export {
  n as default
};
