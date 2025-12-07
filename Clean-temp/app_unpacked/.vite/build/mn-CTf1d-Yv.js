try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "7f085bf2-53cc-43ed-a03b-ea32417898c3", e._sentryDebugIdIdentifier = "sentry-dbid-7f085bf2-53cc-43ed-a03b-ea32417898c3");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "-р хадгалах",
  "jumplist.openCompanionWindowDisplayName": "Хамтрагч цонхыг нээх",
  "jumplist.quitDisplayName": "ChatGPT-с гарах",
  "jumplist.reloadDisplayName": "Дахин ачаалах",
  "loadError.description": "Сүлжээний тохиргоогоо шалгаж ChatGPT-г дахин эхлүүлж үзнэ үү.",
  "loadError.reloadButton": "ChatGPT-г дахин эхлүүлэх",
  "loadError.summary": "ChatGPT-г ачаалах боломжгүй байна.",
  "trayMenu.copyAppInfo": "Аппын мэдээллийг хуулах: {summary}",
  "trayMenu.logout": "Гарах",
  "trayMenu.openCompanionWindow": "Хамтрагч цонхыг нээх",
  "trayMenu.openMainWindow": "ChatGPT цонхыг нээх",
  "trayMenu.quit": "Гарах",
  "trayMenu.reload": "Дахин ачаалах",
  "webContextMenu.addToDictionary": "Толь бичигт нэмэх",
  "webContextMenu.copyImage": "Зургийг хуулах",
  "webContextMenu.copyLink": "Холбоосыг хуулах",
  "webContextMenu.copyText": "Хуулах",
  "webContextMenu.cutText": "Таслах",
  "webContextMenu.pasteText": "Хувилах",
  "webContextMenu.saveImageAs": "Зургийг -р хадгалах",
  "webContextMenu.selectAll": "Бүгдийг сонгох",
  "webContextMenu.showEmoji": "Эможи",
  "webContextMenu.undoEdit": "Буцаах"
};
export {
  t as default
};
