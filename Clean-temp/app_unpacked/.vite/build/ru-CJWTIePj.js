try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "30beec35-b76e-4139-817f-7c673016cf52", e._sentryDebugIdIdentifier = "sentry-dbid-30beec35-b76e-4139-817f-7c673016cf52");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Сохранить как",
  "jumplist.openCompanionWindowDisplayName": "Открыть сопутствующее окно",
  "jumplist.quitDisplayName": "Закрыть ChatGPT",
  "jumplist.reloadDisplayName": "Перезагрузить",
  "loadError.description": "Проверьте настройки сети и попробуйте перезапустить ChatGPT.",
  "loadError.reloadButton": "Перезапустить ChatGPT",
  "loadError.summary": "ChatGPT не может загрузиться",
  "trayMenu.copyAppInfo": "Скопировать информацию о приложении: {summary}",
  "trayMenu.logout": "Выйти",
  "trayMenu.openCompanionWindow": "Открыть сопутствующее окно",
  "trayMenu.openMainWindow": "Открыть окно ChatGPT",
  "trayMenu.quit": "Выйти",
  "trayMenu.reload": "Перезагрузить",
  "webContextMenu.addToDictionary": "Добавить в словарь",
  "webContextMenu.copyImage": "Копировать изображение",
  "webContextMenu.copyLink": "Копировать ссылку",
  "webContextMenu.copyText": "Копировать",
  "webContextMenu.cutText": "Вырезать",
  "webContextMenu.pasteText": "Вставить",
  "webContextMenu.saveImageAs": "Сохранить изображение как",
  "webContextMenu.selectAll": "Выбрать все",
  "webContextMenu.showEmoji": "Эмодзи",
  "webContextMenu.undoEdit": "Отменить"
};
export {
  t as default
};
