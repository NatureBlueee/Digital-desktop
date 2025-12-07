try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "ae02663b-b2e4-41c3-9377-3b89621182ed", e._sentryDebugIdIdentifier = "sentry-dbid-ae02663b-b2e4-41c3-9377-3b89621182ed");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Vista sem",
  "jumplist.openCompanionWindowDisplayName": "Opna hliðarglugga",
  "jumplist.quitDisplayName": "Hætta í ChatGPT",
  "jumplist.reloadDisplayName": "Endurhlaða",
  "loadError.description": "Athugaðu netstillingarnar og prófaðu að endurræsa ChatGPT.",
  "loadError.reloadButton": "Endurræsa ChatGPT",
  "loadError.summary": "Ekki er hægt að hlaða ChatGPT",
  "trayMenu.copyAppInfo": "Afrita upplýsingar um app: {summary}",
  "trayMenu.logout": "Skrá út",
  "trayMenu.openCompanionWindow": "Opna hliðarglugga",
  "trayMenu.openMainWindow": "Opna ChatGPT-glugga",
  "trayMenu.quit": "Hætta",
  "trayMenu.reload": "Endurhlaða",
  "webContextMenu.addToDictionary": "Bæta við orðabók",
  "webContextMenu.copyImage": "Afrita mynd",
  "webContextMenu.copyLink": "Afrita tengil",
  "webContextMenu.copyText": "Afrita",
  "webContextMenu.cutText": "Klippa",
  "webContextMenu.pasteText": "Líma",
  "webContextMenu.saveImageAs": "Vista mynd sem",
  "webContextMenu.selectAll": "Velja allt",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Afturkalla"
};
export {
  t as default
};
