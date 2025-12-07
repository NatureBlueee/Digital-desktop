try {
  (function() {
    var a = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, e = new a.Error().stack;
    e && (a._sentryDebugIds = a._sentryDebugIds || {}, a._sentryDebugIds[e] = "ad7c1a77-dcf0-435e-819c-d9f568270bf2", a._sentryDebugIdIdentifier = "sentry-dbid-ad7c1a77-dcf0-435e-819c-d9f568270bf2");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Simpan Sebagai",
  "jumplist.openCompanionWindowDisplayName": "Buka tetingkap rakan",
  "jumplist.quitDisplayName": "Keluar daripada ChatGPT",
  "jumplist.reloadDisplayName": "Muat semula",
  "loadError.description": "Semak tetapan rangkaian anda dan cuba mulakan semula ChatGPT.",
  "loadError.reloadButton": "Mulakan semula ChatGPT",
  "loadError.summary": "ChatGPT tidak dapat dimuatkan",
  "trayMenu.copyAppInfo": "Salin maklumat apl: {summary}",
  "trayMenu.logout": "Log keluar",
  "trayMenu.openCompanionWindow": "Buka tetingkap rakan",
  "trayMenu.openMainWindow": "Buka tetingkap ChatGPT",
  "trayMenu.quit": "Keluar",
  "trayMenu.reload": "Muat semula",
  "webContextMenu.addToDictionary": "Tambah pada kamus",
  "webContextMenu.copyImage": "Salin imej",
  "webContextMenu.copyLink": "Salin pautan",
  "webContextMenu.copyText": "Salin",
  "webContextMenu.cutText": "Potong",
  "webContextMenu.pasteText": "Tampal",
  "webContextMenu.saveImageAs": "Simpan imej sebagai",
  "webContextMenu.selectAll": "Pilih semua",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Buat asal"
};
export {
  n as default
};
