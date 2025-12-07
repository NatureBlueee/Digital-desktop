try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "32304484-0c6b-4037-9bcc-80c319cdd04d", e._sentryDebugIdIdentifier = "sentry-dbid-32304484-0c6b-4037-9bcc-80c319cdd04d");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "حفظ بصيغة",
  "jumplist.openCompanionWindowDisplayName": "افتح النافذة المرافقة",
  "jumplist.quitDisplayName": "إنهاء تطبيق ChatGPT",
  "jumplist.reloadDisplayName": "إعادة التحميل",
  "loadError.description": "تحقق من إعدادات الشبكة وأعد محاولة تشغيل تطبيق ChatGPT.",
  "loadError.reloadButton": "إعادة تشغيل ChatGPT",
  "loadError.summary": "تعذر تحميل ChatGPT",
  "trayMenu.copyAppInfo": "نسخ معلومات التطبيق: {summary}",
  "trayMenu.logout": "تسجيل الخروج",
  "trayMenu.openCompanionWindow": "افتح النافذة المرافقة",
  "trayMenu.openMainWindow": "افتح نافذة تطبيق ChatGPT",
  "trayMenu.quit": "إنهاء",
  "trayMenu.reload": "إعادة التحميل",
  "webContextMenu.addToDictionary": "أضف إلى القاموس",
  "webContextMenu.copyImage": "نسخ الصورة",
  "webContextMenu.copyLink": "نسخ الرابط",
  "webContextMenu.copyText": "نسخ",
  "webContextMenu.cutText": "قص",
  "webContextMenu.pasteText": "لصق",
  "webContextMenu.saveImageAs": "حفظ الصورة بصيغة",
  "webContextMenu.selectAll": "تحديد الكل",
  "webContextMenu.showEmoji": "رموز تعبيرية",
  "webContextMenu.undoEdit": "تراجع"
};
export {
  t as default
};
