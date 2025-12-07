try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "ff91cd64-8425-41cc-a48a-922a2b347d89", e._sentryDebugIdIdentifier = "sentry-dbid-ff91cd64-8425-41cc-a48a-922a2b347d89");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Salvesta kui",
  "jumplist.openCompanionWindowDisplayName": "Ava kaasaken",
  "jumplist.quitDisplayName": "Välju ChatGPT-st",
  "jumplist.reloadDisplayName": "Laadi uuesti",
  "loadError.description": "Kontrollige oma võrguseadistusi ja proovige ChatGPT taaskäivitamist.",
  "loadError.reloadButton": "Taaskäivita ChatGPT",
  "loadError.summary": "ChatGPT ei saanud laadida",
  "trayMenu.copyAppInfo": "Kopeeri äpi teave: {summary}",
  "trayMenu.logout": "Logi välja",
  "trayMenu.openCompanionWindow": "Ava kaasaken",
  "trayMenu.openMainWindow": "Ava ChatGPT aken",
  "trayMenu.quit": "Välju",
  "trayMenu.reload": "Laadi uuesti",
  "webContextMenu.addToDictionary": "Lisa sõnastikku",
  "webContextMenu.copyImage": "Kopeeri pilt",
  "webContextMenu.copyLink": "Kopeeri link",
  "webContextMenu.copyText": "Kopeeri",
  "webContextMenu.cutText": "Lõika",
  "webContextMenu.pasteText": "Kleebi",
  "webContextMenu.saveImageAs": "Salvesta pilt kui",
  "webContextMenu.selectAll": "Vali kõik",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Ennista"
};
export {
  t as default
};
