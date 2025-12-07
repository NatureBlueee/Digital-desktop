try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "2ea5211f-4d21-47e9-a153-b48a4a19c9e2", e._sentryDebugIdIdentifier = "sentry-dbid-2ea5211f-4d21-47e9-a153-b48a4a19c9e2");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Tallenna nimellä",
  "jumplist.openCompanionWindowDisplayName": "Avaa sivuikkuna",
  "jumplist.quitDisplayName": "Poistu ChatGPT:stä",
  "jumplist.reloadDisplayName": "Lataa uudelleen",
  "loadError.description": "Tarkasta verkkoasetukset ja yritä käynnistää ChatGPT uudelleen.",
  "loadError.reloadButton": "Käynnistä ChatGPT uudelleen",
  "loadError.summary": "ChatGPT:n lataaminen ei onnistu",
  "trayMenu.copyAppInfo": "Kopioi sovelluksen tiedot: {summary}",
  "trayMenu.logout": "Kirjaudu ulos",
  "trayMenu.openCompanionWindow": "Avaa sivuikkuna",
  "trayMenu.openMainWindow": "Avaa ChatGPT-ikkuna",
  "trayMenu.quit": "Lopeta",
  "trayMenu.reload": "Lataa uudelleen",
  "webContextMenu.addToDictionary": "Lisää sanastoon",
  "webContextMenu.copyImage": "Kopioi kuva",
  "webContextMenu.copyLink": "Kopioi linkki",
  "webContextMenu.copyText": "Kopioi",
  "webContextMenu.cutText": "Leikkaa",
  "webContextMenu.pasteText": "Liitä",
  "webContextMenu.saveImageAs": "Tallenna kuva nimellä",
  "webContextMenu.selectAll": "Valitse kaikki",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Kumoa"
};
export {
  n as default
};
