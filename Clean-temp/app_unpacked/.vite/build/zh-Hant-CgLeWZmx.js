try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "e8ee3719-a2a6-4dc6-bc71-6f0e1f2d784b", e._sentryDebugIdIdentifier = "sentry-dbid-e8ee3719-a2a6-4dc6-bc71-6f0e1f2d784b");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "另存為",
  "jumplist.openCompanionWindowDisplayName": "在伴隨視窗",
  "jumplist.quitDisplayName": "退出 ChatGPT",
  "jumplist.reloadDisplayName": "重新載入",
  "loadError.description": "檢查你的網路設定並試著重啟 ChatGPT。",
  "loadError.reloadButton": "重啟 ChatGPT",
  "loadError.summary": "無法載入 ChatGPT",
  "trayMenu.copyAppInfo": "複製應用程式資訊：{summary}",
  "trayMenu.logout": "登出",
  "trayMenu.openCompanionWindow": "在伴隨視窗",
  "trayMenu.openMainWindow": "開啟 ChatGPT 視窗",
  "trayMenu.quit": "退出",
  "trayMenu.reload": "重新載入",
  "webContextMenu.addToDictionary": "新增至字典",
  "webContextMenu.copyImage": "複製圖像",
  "webContextMenu.copyLink": "複製連結",
  "webContextMenu.copyText": "複製",
  "webContextMenu.cutText": "剪下",
  "webContextMenu.pasteText": "貼上",
  "webContextMenu.saveImageAs": "將圖像另存為",
  "webContextMenu.selectAll": "全部選取",
  "webContextMenu.showEmoji": "表情符號",
  "webContextMenu.undoEdit": "復原"
};
export {
  t as default
};
