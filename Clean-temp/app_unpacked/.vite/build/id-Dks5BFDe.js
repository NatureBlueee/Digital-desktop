try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "797dc3b6-397d-41a2-9881-7c0e932b51fd", e._sentryDebugIdIdentifier = "sentry-dbid-797dc3b6-397d-41a2-9881-7c0e932b51fd");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Simpan Sebagai",
  "jumplist.openCompanionWindowDisplayName": "Buka jendela companion",
  "jumplist.quitDisplayName": "Keluar ChatGPT",
  "jumplist.reloadDisplayName": "Muat ulang",
  "loadError.description": "Periksa pengaturan jaringan Anda dan coba mulai ulang ChatGPT.",
  "loadError.reloadButton": "Mulai ulang ChatGPT",
  "loadError.summary": "ChatGPT tidak dapat dimuat",
  "trayMenu.copyAppInfo": "Salin info aplikasi: {summary}",
  "trayMenu.logout": "Keluar",
  "trayMenu.openCompanionWindow": "Buka jendela companion",
  "trayMenu.openMainWindow": "Buka jendela ChatGPT",
  "trayMenu.quit": "Berhenti",
  "trayMenu.reload": "Muat ulang",
  "webContextMenu.addToDictionary": "Tambahkan ke kamus",
  "webContextMenu.copyImage": "Salin gambar",
  "webContextMenu.copyLink": "Salin tautan",
  "webContextMenu.copyText": "Salin",
  "webContextMenu.cutText": "Potong",
  "webContextMenu.pasteText": "Tempel",
  "webContextMenu.saveImageAs": "Simpan gambar sebagai",
  "webContextMenu.selectAll": "Pilih semua",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Urungkan"
};
export {
  n as default
};
