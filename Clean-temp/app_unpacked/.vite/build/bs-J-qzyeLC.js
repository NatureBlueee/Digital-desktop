try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, o = new e.Error().stack;
    o && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[o] = "5d3c9af8-b7a0-45a1-baa7-92c04a07fec2", e._sentryDebugIdIdentifier = "sentry-dbid-5d3c9af8-b7a0-45a1-baa7-92c04a07fec2");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Spremi kao",
  "jumplist.openCompanionWindowDisplayName": "Otvori u dodatnom prozoru",
  "jumplist.quitDisplayName": "Otkažite ChatGPT",
  "jumplist.reloadDisplayName": "Učitati ponovo",
  "loadError.description": "Provjerite svoja mrežna podešavanja i pokušajte ponovo pokrenuti ChatGPT.",
  "loadError.reloadButton": "Pokrenite ponovo ChatGPT",
  "loadError.summary": "Nije moguće učitati ChatGPT",
  "trayMenu.copyAppInfo": "Kopiraj informacije o aplikaciji: {summary}",
  "trayMenu.logout": "Odjavi se",
  "trayMenu.openCompanionWindow": "Otvorite u dodatnom prozoru",
  "trayMenu.openMainWindow": "Otvorite ChatGPT prozor",
  "trayMenu.quit": "`Otkaži",
  "trayMenu.reload": "Učitati ponovo",
  "webContextMenu.addToDictionary": "Dodaj u rječnik",
  "webContextMenu.copyImage": "Kopiraj sliku",
  "webContextMenu.copyLink": "Kopiraj link",
  "webContextMenu.copyText": "Kopiraj",
  "webContextMenu.cutText": "Izreži",
  "webContextMenu.pasteText": "Zalijepi",
  "webContextMenu.saveImageAs": "Spremi sliku kao",
  "webContextMenu.selectAll": "Odaberi sve",
  "webContextMenu.showEmoji": "Emotikon",
  "webContextMenu.undoEdit": "Poništi"
};
export {
  t as default
};
