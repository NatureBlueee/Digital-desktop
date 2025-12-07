try {
  (function() {
    var o = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, e = new o.Error().stack;
    e && (o._sentryDebugIds = o._sentryDebugIds || {}, o._sentryDebugIds[e] = "ddd70d81-0976-420a-b0ba-994c3670f49a", o._sentryDebugIdIdentifier = "sentry-dbid-ddd70d81-0976-420a-b0ba-994c3670f49a");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Uložiť ako",
  "jumplist.openCompanionWindowDisplayName": "Otvoriť sprievodné okno",
  "jumplist.quitDisplayName": "Ukončiť ChatGPT",
  "jumplist.reloadDisplayName": "Načítať znova",
  "loadError.description": "Skontroluj nastavenia siete a skús reštartovať modul ChatGPT.",
  "loadError.reloadButton": "Reštartovať modul ChatGPT",
  "loadError.summary": "Modul ChatGPT nie je možné načítať",
  "trayMenu.copyAppInfo": "Skopírovať informácie o aplikácii: {summary}",
  "trayMenu.logout": "Odhlásiť sa",
  "trayMenu.openCompanionWindow": "Otvoriť sprievodné okno",
  "trayMenu.openMainWindow": "Otvoriť okno ChatGPT",
  "trayMenu.quit": "Ukončiť",
  "trayMenu.reload": "Načítať znova",
  "webContextMenu.addToDictionary": "Pridať do slovníka",
  "webContextMenu.copyImage": "Kopírovať obrázok",
  "webContextMenu.copyLink": "Kopírovať odkaz",
  "webContextMenu.copyText": "Kopírovať",
  "webContextMenu.cutText": "Vystrihnúť",
  "webContextMenu.pasteText": "Prilepiť",
  "webContextMenu.saveImageAs": "Uložiť obrázok ako",
  "webContextMenu.selectAll": "Vybrať všetko",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Zrušiť zmeny"
};
export {
  n as default
};
