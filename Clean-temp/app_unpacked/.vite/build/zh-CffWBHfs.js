try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "e3ed1df2-d094-43ac-9ee7-c9bdb49d906b", e._sentryDebugIdIdentifier = "sentry-dbid-e3ed1df2-d094-43ac-9ee7-c9bdb49d906b");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "另存为",
  "jumplist.openCompanionWindowDisplayName": "打开伴随浮窗",
  "jumplist.quitDisplayName": "退出 ChatGPT",
  "jumplist.reloadDisplayName": "重新加载",
  "loadError.description": "检查您的网络设置并尝试重启 ChatGPT。",
  "loadError.reloadButton": "重启 ChatGPT",
  "loadError.summary": "ChatGPT 无法加载",
  "trayMenu.copyAppInfo": "复制应用信息：{summary}",
  "trayMenu.logout": "注销",
  "trayMenu.openCompanionWindow": "打开伴随浮窗",
  "trayMenu.openMainWindow": "打开 ChatGPT 窗口",
  "trayMenu.quit": "退出",
  "trayMenu.reload": "重新加载",
  "webContextMenu.addToDictionary": "添加到字典",
  "webContextMenu.copyImage": "复制图片",
  "webContextMenu.copyLink": "复制链接",
  "webContextMenu.copyText": "复制",
  "webContextMenu.cutText": "剪切",
  "webContextMenu.pasteText": "粘贴",
  "webContextMenu.saveImageAs": "将图片另存为",
  "webContextMenu.selectAll": "选择全部",
  "webContextMenu.showEmoji": "表情符号",
  "webContextMenu.undoEdit": "撤销"
};
export {
  t as default
};
