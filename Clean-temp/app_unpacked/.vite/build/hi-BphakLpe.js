try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "c585b53f-16d1-4ee4-81e2-65cd4680ce23", e._sentryDebugIdIdentifier = "sentry-dbid-c585b53f-16d1-4ee4-81e2-65cd4680ce23");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "ऐसे सेव करें",
  "jumplist.openCompanionWindowDisplayName": "कंपैनियन विंडो खोलें",
  "jumplist.quitDisplayName": "ChatGPT छोड़ें",
  "jumplist.reloadDisplayName": "दोबारा लोड करें",
  "loadError.description": "अपनी नेटवर्क सेटिंग्स चेक करें और ChatGPT को दोबारा शुरू करने की कोशिश करें।",
  "loadError.reloadButton": "ChatGPT को रीस्टार्ट करें",
  "loadError.summary": "ChatGPT लोड नहीं हो पा रहा है",
  "trayMenu.copyAppInfo": "ऐप की जानकारी कॉपी करें: {summary}",
  "trayMenu.logout": "लॉग आउट करें",
  "trayMenu.openCompanionWindow": "कंपैनियन विंडो खोलें",
  "trayMenu.openMainWindow": "ChatGPT विंडो खोलें",
  "trayMenu.quit": "छोड़ें",
  "trayMenu.reload": "दोबारा लोड करें",
  "webContextMenu.addToDictionary": "शब्दकोश में जोड़ें",
  "webContextMenu.copyImage": "इमेज कॉपी करें",
  "webContextMenu.copyLink": "लिंक कॉपी करें",
  "webContextMenu.copyText": "कॉपी करें",
  "webContextMenu.cutText": "कट",
  "webContextMenu.pasteText": "पेस्ट",
  "webContextMenu.saveImageAs": "इमेज को ऐसे सेव करें",
  "webContextMenu.selectAll": "सभी को सिलेक्ट करें",
  "webContextMenu.showEmoji": "इमोजी",
  "webContextMenu.undoEdit": "पहले जैसा करें"
};
export {
  t as default
};
