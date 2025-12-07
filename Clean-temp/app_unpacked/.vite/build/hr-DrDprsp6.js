try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, o = new e.Error().stack;
    o && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[o] = "f2f29aeb-090b-45d8-9aaf-0359787852b6", e._sentryDebugIdIdentifier = "sentry-dbid-f2f29aeb-090b-45d8-9aaf-0359787852b6");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Spremi kao",
  "jumplist.openCompanionWindowDisplayName": "Otvori prateći prozor",
  "jumplist.quitDisplayName": "Izađi iz ChatGPT-ja",
  "jumplist.reloadDisplayName": "Ponovno učitaj",
  "loadError.description": "Provjerite mrežne postavke i pokušajte ponovno pokrenuti ChatGPT.",
  "loadError.reloadButton": "Ponovno pokrenite ChatGPT",
  "loadError.summary": "ChatGPT ne može se učitati",
  "trayMenu.copyAppInfo": "Kopiraj informacije o aplikaciji: {summary}",
  "trayMenu.logout": "Odjavite se",
  "trayMenu.openCompanionWindow": "Otvori prateći prozor",
  "trayMenu.openMainWindow": "Otvori prozor za ChatGPT",
  "trayMenu.quit": "Izađi",
  "trayMenu.reload": "Ponovno učitaj",
  "webContextMenu.addToDictionary": "Dodaj u rječnik",
  "webContextMenu.copyImage": "Kopiraj sliku",
  "webContextMenu.copyLink": "Kopiraj poveznicu",
  "webContextMenu.copyText": "Kopiraj",
  "webContextMenu.cutText": "Izreži",
  "webContextMenu.pasteText": "Zalijepi",
  "webContextMenu.saveImageAs": "Spremi sliku kao",
  "webContextMenu.selectAll": "Odaberi sve",
  "webContextMenu.showEmoji": "Emotikon",
  "webContextMenu.undoEdit": "Poništi"
};
export {
  n as default
};
