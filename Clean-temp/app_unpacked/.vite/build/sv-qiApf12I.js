try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "7540d4c9-a92e-402e-ba04-49ee3772cdf9", e._sentryDebugIdIdentifier = "sentry-dbid-7540d4c9-a92e-402e-ba04-49ee3772cdf9");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Spara som",
  "jumplist.openCompanionWindowDisplayName": "Öppna följeslagande fönster",
  "jumplist.quitDisplayName": "Avsluta ChatGPT",
  "jumplist.reloadDisplayName": "Läs in på nytt",
  "loadError.description": "Kontrollera dina nätverksinställningar och prova att starta om ChatGPT.",
  "loadError.reloadButton": "Starta om ChatGPT",
  "loadError.summary": "ChatGPT kunde inte läsas in",
  "trayMenu.copyAppInfo": "Kopiera appinformation: {summary}",
  "trayMenu.logout": "Logga ut",
  "trayMenu.openCompanionWindow": "Öppna följeslagande fönster",
  "trayMenu.openMainWindow": "Öppna ChatGPT-fönster",
  "trayMenu.quit": "Avsluta",
  "trayMenu.reload": "Läs in på nytt",
  "webContextMenu.addToDictionary": "Lägg till i ordbok",
  "webContextMenu.copyImage": "Kopiera bilden",
  "webContextMenu.copyLink": "Kopiera länken",
  "webContextMenu.copyText": "Kopiera",
  "webContextMenu.cutText": "Klipp ut",
  "webContextMenu.pasteText": "Klistra in",
  "webContextMenu.saveImageAs": "Spara bilden som",
  "webContextMenu.selectAll": "Markera allt",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Ångra"
};
export {
  t as default
};
