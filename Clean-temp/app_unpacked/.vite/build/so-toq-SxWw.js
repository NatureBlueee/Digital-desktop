try {
  (function() {
    var a = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, o = new a.Error().stack;
    o && (a._sentryDebugIds = a._sentryDebugIds || {}, a._sentryDebugIds[o] = "7a771ca6-27f0-4729-a69a-b1737956faa2", a._sentryDebugIdIdentifier = "sentry-dbid-7a771ca6-27f0-4729-a69a-b1737956faa2");
  })();
} catch {
}
const e = {
  "downloadManager.saveAsDialogTitle": "U kaydi sida",
  "jumplist.openCompanionWindowDisplayName": "Ka fur shaashada la socota",
  "jumplist.quitDisplayName": "Ka bax ChatGPT",
  "jumplist.reloadDisplayName": "Dib u soo kici",
  "loadError.description": "Ka eeg setinka shabakadaada oo isku day dib u soo bilaabida ChatGPT.",
  "loadError.reloadButton": "Dib u bilow ChatGPT\\",
  "loadError.summary": "ChatGPT ma awoodo inay soo kacdo",
  "trayMenu.copyAppInfo": "Soo koobiyee macluumaadka abka: {summary}",
  "trayMenu.logout": "Ka bax",
  "trayMenu.openCompanionWindow": "Ka fur shaashada la socota",
  "trayMenu.openMainWindow": "Fur Daaqada ChatGPT",
  "trayMenu.quit": "Ka bax",
  "trayMenu.reload": "Dib u soo kici",
  "webContextMenu.addToDictionary": "Ku dar qaamuuska",
  "webContextMenu.copyImage": "Soo koobiyee sawirka",
  "webContextMenu.copyLink": "Soo koobiyee linkiga",
  "webContextMenu.copyText": "Koobiyee",
  "webContextMenu.cutText": "Jar",
  "webContextMenu.pasteText": "Soodhig",
  "webContextMenu.saveImageAs": "U kaydi sawirka sida",
  "webContextMenu.selectAll": "Dooro dhammaan",
  "webContextMenu.showEmoji": "Imooji",
  "webContextMenu.undoEdit": "Ka noqo"
};
export {
  e as default
};
