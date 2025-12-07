try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0e096966-bf12-43e5-9a45-0d36bf0c8e4a", e._sentryDebugIdIdentifier = "sentry-dbid-0e096966-bf12-43e5-9a45-0d36bf0c8e4a");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "አስቀምጥ እንደ",
  "jumplist.openCompanionWindowDisplayName": "አጋር መስኮትን ክፈት",
  "jumplist.quitDisplayName": "ChatGPTን ተው",
  "jumplist.reloadDisplayName": "ዳግም ጫን",
  "loadError.description": "የአውታረ መረብ ቅንብሮችዎን ይፈትሹ እና ChatGPT ን እንደገና ለማስጀመር ይሞክሩ።",
  "loadError.reloadButton": "ChatGPT እንደገና ያስጀምሩ",
  "loadError.summary": "ChatGPT መጫን አልቻለም",
  "trayMenu.copyAppInfo": "የመተግበሪያ መረጃ ቅዳ፦ {summary}",
  "trayMenu.logout": "ውጣ",
  "trayMenu.openCompanionWindow": "አጋር መስኮትን ክፈት",
  "trayMenu.openMainWindow": "የChatGPT Windowን ክፈት",
  "trayMenu.quit": "ተው",
  "trayMenu.reload": "ዳግም ጫን",
  "webContextMenu.addToDictionary": "ወደ መዝገበ ቃላት አክል",
  "webContextMenu.copyImage": "ምስል ቅዳ",
  "webContextMenu.copyLink": "አገናኝ ቅዳ",
  "webContextMenu.copyText": "ቅዳ",
  "webContextMenu.cutText": "ቁረጥ",
  "webContextMenu.pasteText": "ለጥፍ",
  "webContextMenu.saveImageAs": "ምስልን አስቀምጥ እንደ",
  "webContextMenu.selectAll": "ሁሉንም ይምረጡ",
  "webContextMenu.showEmoji": "ስሜት ገላጭ ምስል",
  "webContextMenu.undoEdit": "ቀልብስ"
};
export {
  t as default
};
