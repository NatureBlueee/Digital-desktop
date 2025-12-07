try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "8b40458d-756d-4a74-b79b-026988b263c4", e._sentryDebugIdIdentifier = "sentry-dbid-8b40458d-756d-4a74-b79b-026988b263c4");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Келесі ретінде сақтау",
  "jumplist.openCompanionWindowDisplayName": "Серіктес терезесін ашу",
  "jumplist.quitDisplayName": "ChatGPT-ден шығу",
  "jumplist.reloadDisplayName": "Қайта жүктеу",
  "loadError.description": "Желі параметрлерін тексеріп, ChatGPT қызметін қайта іске қосып көріңіз.",
  "loadError.reloadButton": "ChatGPT қызметін қайта іске қосу",
  "loadError.summary": "ChatGPT жүктелмейді",
  "trayMenu.copyAppInfo": "Қолданба ақпаратын көшіру: {summary}",
  "trayMenu.logout": "Шығу",
  "trayMenu.openCompanionWindow": "Серіктес терезесін ашу",
  "trayMenu.openMainWindow": "ChatGPT терезесін ашу",
  "trayMenu.quit": "Шығу",
  "trayMenu.reload": "Қайта жүктеу",
  "webContextMenu.addToDictionary": "Сөздікке қосу",
  "webContextMenu.copyImage": "Кескінді көшіру",
  "webContextMenu.copyLink": "Сілтемені көшіру",
  "webContextMenu.copyText": "Көшіру",
  "webContextMenu.cutText": "Қию",
  "webContextMenu.pasteText": "Қою",
  "webContextMenu.saveImageAs": "Кескінді келесі ретінде сақтау",
  "webContextMenu.selectAll": "Барлығын таңдау",
  "webContextMenu.showEmoji": "Эмоджи",
  "webContextMenu.undoEdit": "Қайтару"
};
export {
  t as default
};
