try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "cdf36405-5323-41c6-8382-134b79d175b9", e._sentryDebugIdIdentifier = "sentry-dbid-cdf36405-5323-41c6-8382-134b79d175b9");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Lagre som",
  "jumplist.openCompanionWindowDisplayName": "Åpne ledsagervindu",
  "jumplist.quitDisplayName": "Avslutt ChatGPT",
  "jumplist.reloadDisplayName": "Last inn på nytt",
  "loadError.description": "Kontroller nettverksinnstillingene og prøv å starte ChatGPT på nytt.",
  "loadError.reloadButton": "Start ChatGPT på nytt",
  "loadError.summary": "Kan ikke laste inn ChatGPT",
  "trayMenu.copyAppInfo": "Kopier appinfo: {summary}",
  "trayMenu.logout": "Logg ut",
  "trayMenu.openCompanionWindow": "Åpne ledsagervindu",
  "trayMenu.openMainWindow": "Åpne ChatGPT-vindu",
  "trayMenu.quit": "Avslutt",
  "trayMenu.reload": "Last inn på nytt",
  "webContextMenu.addToDictionary": "Legg til i ordliste",
  "webContextMenu.copyImage": "Kopier bilde",
  "webContextMenu.copyLink": "Kopier lenke",
  "webContextMenu.copyText": "Kopier",
  "webContextMenu.cutText": "Klipp ut",
  "webContextMenu.pasteText": "Lim inn",
  "webContextMenu.saveImageAs": "Lagre bilde som",
  "webContextMenu.selectAll": "Velg alle",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Angre"
};
export {
  t as default
};
