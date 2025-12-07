try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "a724ce81-a363-42b2-8405-8043e25cad4d", e._sentryDebugIdIdentifier = "sentry-dbid-a724ce81-a363-42b2-8405-8043e25cad4d");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Зачувај како",
  "jumplist.openCompanionWindowDisplayName": "Отвори придружен прозорец",
  "jumplist.quitDisplayName": "Излези од ChatGPT",
  "jumplist.reloadDisplayName": "Вчитај повторно",
  "loadError.description": "Провери ги поставките на мрежата и пробај да го рестартираш ChatGPT.",
  "loadError.reloadButton": "Рестартирај го ChatGPT",
  "loadError.summary": "ChatGPT не може да се вчита",
  "trayMenu.copyAppInfo": "Копирај ги информациите за апликацијата: {summary}",
  "trayMenu.logout": "Одјави се",
  "trayMenu.openCompanionWindow": "Отвори придружен прозорец",
  "trayMenu.openMainWindow": "Отвори прозорец на ChatGPT",
  "trayMenu.quit": "Излези",
  "trayMenu.reload": "Вчитај повторно",
  "webContextMenu.addToDictionary": "Додај во речник",
  "webContextMenu.copyImage": "Копирај слика",
  "webContextMenu.copyLink": "Копирај линк",
  "webContextMenu.copyText": "Копирај",
  "webContextMenu.cutText": "Исечи",
  "webContextMenu.pasteText": "Залепи",
  "webContextMenu.saveImageAs": "Зачувај слика како",
  "webContextMenu.selectAll": "Означи ги сите",
  "webContextMenu.showEmoji": "Емоџи",
  "webContextMenu.undoEdit": "Отправи"
};
export {
  t as default
};
