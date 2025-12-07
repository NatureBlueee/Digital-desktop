try {
  (function() {
    var n = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, e = new n.Error().stack;
    e && (n._sentryDebugIds = n._sentryDebugIds || {}, n._sentryDebugIds[e] = "f756cafa-4322-4c81-8f4b-2b7a9f6cdaab", n._sentryDebugIdIdentifier = "sentry-dbid-f756cafa-4322-4c81-8f4b-2b7a9f6cdaab");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Lưu dưới dạng",
  "jumplist.openCompanionWindowDisplayName": "Mở cửa sổ đồng hành",
  "jumplist.quitDisplayName": "Thoát ChatGPT",
  "jumplist.reloadDisplayName": "Tải lại",
  "loadError.description": "Kiểm tra cài đặt mạng của bạn và thử khởi động lại ChatGPT.",
  "loadError.reloadButton": "Khởi động lại ChatGPT",
  "loadError.summary": "ChatGPT không thể tải",
  "trayMenu.copyAppInfo": "Sao chép thông tin ứng dụng: {summary}",
  "trayMenu.logout": "Đăng xuất",
  "trayMenu.openCompanionWindow": "Mở cửa sổ đồng hành",
  "trayMenu.openMainWindow": "Mở cửa sổ ChatGPT",
  "trayMenu.quit": "Thoát",
  "trayMenu.reload": "Tải lại",
  "webContextMenu.addToDictionary": "Thêm vào từ điển",
  "webContextMenu.copyImage": "Sao chép hình ảnh",
  "webContextMenu.copyLink": "Sao chép liên kết",
  "webContextMenu.copyText": "Sao chép",
  "webContextMenu.cutText": "Cắt",
  "webContextMenu.pasteText": "Dán",
  "webContextMenu.saveImageAs": "Lưu hình ảnh dưới dạng",
  "webContextMenu.selectAll": "Chọn tất cả",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Hoàn tác"
};
export {
  t as default
};
