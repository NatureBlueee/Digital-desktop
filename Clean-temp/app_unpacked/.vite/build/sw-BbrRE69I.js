try {
  (function() {
    var a = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, e = new a.Error().stack;
    e && (a._sentryDebugIds = a._sentryDebugIds || {}, a._sentryDebugIds[e] = "0b8acd42-0340-44b2-a989-f1a3f0fc0e83", a._sentryDebugIdIdentifier = "sentry-dbid-0b8acd42-0340-44b2-a989-f1a3f0fc0e83");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Hifadhi kama",
  "jumplist.openCompanionWindowDisplayName": "Fungua dirisha la mwenzi",
  "jumplist.quitDisplayName": "Toka kwenye ChatGPT",
  "jumplist.reloadDisplayName": "Pakia upya",
  "loadError.description": "Angalia mipangilio ya mtandao wako kisha jaribu kuanzisha ChatGPT upya.",
  "loadError.reloadButton": "Anzisha ChatGPT upya",
  "loadError.summary": "ChatGPT haikuweza kupakia",
  "trayMenu.copyAppInfo": "Nakili maelezo ya programu: {summary}",
  "trayMenu.logout": "Ondoka",
  "trayMenu.openCompanionWindow": "Fungua dirisha la mwenzi",
  "trayMenu.openMainWindow": "Fungua dirisha ya ChatGPT",
  "trayMenu.quit": "Toka",
  "trayMenu.reload": "Pakia upya",
  "webContextMenu.addToDictionary": "Ongeza kwenye kamusi",
  "webContextMenu.copyImage": "Nakili picha",
  "webContextMenu.copyLink": "Nakili kiungo",
  "webContextMenu.copyText": "Nakili",
  "webContextMenu.cutText": "Nakili na uondoe",
  "webContextMenu.pasteText": "Bandika",
  "webContextMenu.saveImageAs": "Hifadhi picha kama",
  "webContextMenu.selectAll": "Chagua zote",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Tendua"
};
export {
  n as default
};
