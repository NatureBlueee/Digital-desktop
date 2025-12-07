try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "8fa11984-6a24-418f-bd45-a57b3fee7d61", e._sentryDebugIdIdentifier = "sentry-dbid-8fa11984-6a24-418f-bd45-a57b3fee7d61");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Запазване като",
  "jumplist.openCompanionWindowDisplayName": "Отваряне на съпътстващия прозорец",
  "jumplist.quitDisplayName": "Напускане на ChatGPT",
  "jumplist.reloadDisplayName": "Презареждане",
  "loadError.description": "Проверете мрежовите си настройки и се опитайте да рестартирате ChatGPT.",
  "loadError.reloadButton": "Рестартиране на ChatGPT",
  "loadError.summary": "ChatGPT не може да се зареди",
  "trayMenu.copyAppInfo": "Копиране на информация за апа: {summary}",
  "trayMenu.logout": "Излизане от акаунта",
  "trayMenu.openCompanionWindow": "Отваряне на съпътстващия прозорец",
  "trayMenu.openMainWindow": "Отваряне на прозореца на ChatGPT",
  "trayMenu.quit": "Напускане",
  "trayMenu.reload": "Презареждане",
  "webContextMenu.addToDictionary": "Добавяне към речника",
  "webContextMenu.copyImage": "Копиране на изображение",
  "webContextMenu.copyLink": "Копиране на връзка",
  "webContextMenu.copyText": "Копиране",
  "webContextMenu.cutText": "Изрязване",
  "webContextMenu.pasteText": "Поставяне",
  "webContextMenu.saveImageAs": "Запазване на изображението като",
  "webContextMenu.selectAll": "Изберете всички",
  "webContextMenu.showEmoji": "Емотикони",
  "webContextMenu.undoEdit": "Отмяна"
};
export {
  t as default
};
