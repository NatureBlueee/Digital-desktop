try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "54fb6466-9ee5-40f0-9163-d1e54d274a2a", e._sentryDebugIdIdentifier = "sentry-dbid-54fb6466-9ee5-40f0-9163-d1e54d274a2a");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Αποθήκευση ως",
  "jumplist.openCompanionWindowDisplayName": "Άνοιγμα παραθύρου Companion",
  "jumplist.quitDisplayName": "Έξοδος από το ChatGPT",
  "jumplist.reloadDisplayName": "Επαναφόρτωση",
  "loadError.description": "Κάνε έλεγχο στις ρυθμίσεις δικτύου και προσπάθησε να επανεκκινήσεις το ChatGPT.",
  "loadError.reloadButton": "Επανεκκίνηση του ChatGPT",
  "loadError.summary": "Αδυναμία φόρτωσης του ChatGPT",
  "trayMenu.copyAppInfo": "Αντιγραφή πληροφοριών εφαρμογής: {summary}",
  "trayMenu.logout": "Αποσύνδεση",
  "trayMenu.openCompanionWindow": "Άνοιγμα παραθύρου Companion",
  "trayMenu.openMainWindow": "Άνοιγμα παραθύρου του ChatGPT",
  "trayMenu.quit": "Έξοδος",
  "trayMenu.reload": "Επαναφόρτωση",
  "webContextMenu.addToDictionary": "Προσθήκη στο λεξικό",
  "webContextMenu.copyImage": "Αντιγραφή εικόνας",
  "webContextMenu.copyLink": "Αντιγραφή συνδέσμου",
  "webContextMenu.copyText": "Αντιγραφή",
  "webContextMenu.cutText": "Αποκοπή",
  "webContextMenu.pasteText": "Επικόλληση",
  "webContextMenu.saveImageAs": "Αποθήκευση εικόνας ως",
  "webContextMenu.selectAll": "Επιλογή όλων",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Αναίρεση"
};
export {
  t as default
};
