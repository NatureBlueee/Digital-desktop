try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "c7e69c0b-a61e-4aa9-ace4-18bc5ed82a40", e._sentryDebugIdIdentifier = "sentry-dbid-c7e69c0b-a61e-4aa9-ace4-18bc5ed82a40");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "এই হিসাবে সেভ করুন",
  "jumplist.openCompanionWindowDisplayName": "কম্প্যানিয়ন উইন্ডো খুলুন",
  "jumplist.quitDisplayName": "ChatGPT থেকে প্রস্থান করুন",
  "jumplist.reloadDisplayName": "পুনরায় লোড করুন",
  "loadError.description": "আপনার নেটওয়ার্ক সেটিংস পরীক্ষা করুন এবং ChatGPT পুনরায় শুরু করার চেষ্টা করুন।",
  "loadError.reloadButton": "ChatGPT পুনরায় শুরু করুন",
  "loadError.summary": "ChatGPT লোড করা যাচ্ছে না",
  "trayMenu.copyAppInfo": "অ্যাপের তথ্য কপি করুন: {summary}",
  "trayMenu.logout": "লগ-আউট করুন",
  "trayMenu.openCompanionWindow": "কম্প্যানিয়ন উইন্ডো খুলুন",
  "trayMenu.openMainWindow": "ChatGPT উইন্ডো খুলুন",
  "trayMenu.quit": "প্রস্থান করুন",
  "trayMenu.reload": "পুনরায় লোড করুন",
  "webContextMenu.addToDictionary": "অভিধানে যোগ করুন",
  "webContextMenu.copyImage": "ছবি কপি করুন",
  "webContextMenu.copyLink": "লিঙ্ক কপি করুন",
  "webContextMenu.copyText": "কপি করুন",
  "webContextMenu.cutText": "কাট করুন",
  "webContextMenu.pasteText": "পেস্ট করুন",
  "webContextMenu.saveImageAs": "এই হিসাবে ছবি সেভ করুন",
  "webContextMenu.selectAll": "সবকটি নির্বাচন করুন",
  "webContextMenu.showEmoji": "ইমোজি",
  "webContextMenu.undoEdit": "পূর্বাবস্থায় ফেরান"
};
export {
  t as default
};
