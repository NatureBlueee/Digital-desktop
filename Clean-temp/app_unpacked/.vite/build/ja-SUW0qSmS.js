try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "318705e0-6ce1-45b0-a3c5-4c64e3666431", e._sentryDebugIdIdentifier = "sentry-dbid-318705e0-6ce1-45b0-a3c5-4c64e3666431");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "名前を付けて保存",
  "jumplist.openCompanionWindowDisplayName": "コンパニオン ウィンドウを開く",
  "jumplist.quitDisplayName": "ChatGPT を終了する",
  "jumplist.reloadDisplayName": "再読み込み",
  "loadError.description": "ネットワーク設定を確認してから ChatGPT を再起動してみてください。",
  "loadError.reloadButton": "ChatGPT を再起動する",
  "loadError.summary": "ChatGPT を読み込めません",
  "trayMenu.copyAppInfo": "アプリ情報のコピー: {summary}",
  "trayMenu.logout": "ログアウト",
  "trayMenu.openCompanionWindow": "コンパニオン ウィンドウを開く",
  "trayMenu.openMainWindow": "ChatGPT ウィンドウを開く",
  "trayMenu.quit": "終了",
  "trayMenu.reload": "再読み込み",
  "webContextMenu.addToDictionary": "辞書に追加する",
  "webContextMenu.copyImage": "画像のコピー",
  "webContextMenu.copyLink": "リンクのコピー",
  "webContextMenu.copyText": "コピー",
  "webContextMenu.cutText": "切り取り",
  "webContextMenu.pasteText": "貼り付け",
  "webContextMenu.saveImageAs": "名前を付けて画像を保存",
  "webContextMenu.selectAll": "すべて選択",
  "webContextMenu.showEmoji": "絵文字",
  "webContextMenu.undoEdit": "元に戻す"
};
export {
  t as default
};
