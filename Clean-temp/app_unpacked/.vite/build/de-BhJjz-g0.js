try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "7bf75099-45a0-45f4-9c01-49d57fc5f36f", e._sentryDebugIdIdentifier = "sentry-dbid-7bf75099-45a0-45f4-9c01-49d57fc5f36f");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Speichern unter",
  "jumplist.openCompanionWindowDisplayName": "Companion-Fenster öffnen",
  "jumplist.quitDisplayName": "ChatGPT verlassen",
  "jumplist.reloadDisplayName": "Neu laden",
  "loadError.description": "Überprüfe deine Netzwerkeinstellungen und versuche, ChatGPT neu zu starten.",
  "loadError.reloadButton": "ChatGPT neu starten",
  "loadError.summary": "ChatGPT kann nicht geladen werden",
  "trayMenu.copyAppInfo": "App-Info kopieren: {summary}",
  "trayMenu.logout": "Abmelden",
  "trayMenu.openCompanionWindow": "Companion-Fenster öffnen",
  "trayMenu.openMainWindow": "ChatGPT-Fenster öffnen",
  "trayMenu.quit": "Beenden",
  "trayMenu.reload": "Neu laden",
  "webContextMenu.addToDictionary": "Zum Wörterbuch hinzufügen",
  "webContextMenu.copyImage": "Bild kopieren",
  "webContextMenu.copyLink": "Link kopieren",
  "webContextMenu.copyText": "Kopieren",
  "webContextMenu.cutText": "Ausschneiden",
  "webContextMenu.pasteText": "Einfügen",
  "webContextMenu.saveImageAs": "Bild speichern unter",
  "webContextMenu.selectAll": "Alles auswählen",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Rückgängig"
};
export {
  t as default
};
