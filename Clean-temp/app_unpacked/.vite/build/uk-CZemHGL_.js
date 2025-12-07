try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0ac34953-4097-4488-acca-5dcac42d9b56", e._sentryDebugIdIdentifier = "sentry-dbid-0ac34953-4097-4488-acca-5dcac42d9b56");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Зберегти як",
  "jumplist.openCompanionWindowDisplayName": "Відкрити додаткове вікно",
  "jumplist.quitDisplayName": "Вийти з ChatGPT",
  "jumplist.reloadDisplayName": "Перезавантажити",
  "loadError.description": "Перевірте налаштування мережі та спробуйте перезапустити ChatGPT.",
  "loadError.reloadButton": "Перезапустити ChatGPT",
  "loadError.summary": "Не вдалося завантажити ChatGPT",
  "trayMenu.copyAppInfo": "Копіювати інформацію про програму: {summary}",
  "trayMenu.logout": "Вийти",
  "trayMenu.openCompanionWindow": "Відкрити додаткове вікно",
  "trayMenu.openMainWindow": "Відкрити вікно ChatGPT",
  "trayMenu.quit": "Вийти",
  "trayMenu.reload": "Перезавантажити",
  "webContextMenu.addToDictionary": "Додати в словник",
  "webContextMenu.copyImage": "Копіювати зображення",
  "webContextMenu.copyLink": "Копіювати посилання",
  "webContextMenu.copyText": "Копіювати",
  "webContextMenu.cutText": "Вирізати",
  "webContextMenu.pasteText": "Вставити",
  "webContextMenu.saveImageAs": "Зберегти зображення як",
  "webContextMenu.selectAll": "Вибрати все",
  "webContextMenu.showEmoji": "Емодзі",
  "webContextMenu.undoEdit": "Скасувати"
};
export {
  t as default
};
