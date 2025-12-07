try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, o = new e.Error().stack;
    o && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[o] = "09c126ca-017f-4f78-82f5-758972db77d5", e._sentryDebugIdIdentifier = "sentry-dbid-09c126ca-017f-4f78-82f5-758972db77d5");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Zapisz jako",
  "jumplist.openCompanionWindowDisplayName": "Otwórz okno podręczne",
  "jumplist.quitDisplayName": "Zamknij ChatGPT",
  "jumplist.reloadDisplayName": "Załaduj ponownie",
  "loadError.description": "Sprawdź ustawienia sieci i spróbuj ponownie uruchomić czatbota ChatGPT.",
  "loadError.reloadButton": "Uruchom ponownie czatbota ChatGPT",
  "loadError.summary": "Nie można załadować czatbota ChatGPT",
  "trayMenu.copyAppInfo": "Skopiuj informacje o aplikacji: {summary}",
  "trayMenu.logout": "Wyloguj się",
  "trayMenu.openCompanionWindow": "Otwórz okno podręczne",
  "trayMenu.openMainWindow": "Otwórz okno ChatGPT",
  "trayMenu.quit": "Wyjdź",
  "trayMenu.reload": "Załaduj ponownie",
  "webContextMenu.addToDictionary": "Dodaj do słownika",
  "webContextMenu.copyImage": "Kopiuj obraz",
  "webContextMenu.copyLink": "Kopiuj link",
  "webContextMenu.copyText": "Kopiuj",
  "webContextMenu.cutText": "Wytnij",
  "webContextMenu.pasteText": "Wklej",
  "webContextMenu.saveImageAs": "Zapisz obraz jako",
  "webContextMenu.selectAll": "Wybierz wszystko",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Cofnij"
};
export {
  n as default
};
