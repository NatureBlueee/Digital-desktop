try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "5b443952-5fdb-448d-a93b-e47abf3c2ee8", e._sentryDebugIdIdentifier = "sentry-dbid-5b443952-5fdb-448d-a93b-e47abf3c2ee8");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "다른 이름으로 저장",
  "jumplist.openCompanionWindowDisplayName": "컴패니언 창 열기",
  "jumplist.quitDisplayName": "ChatGPT 종료",
  "jumplist.reloadDisplayName": "다시 불러오기",
  "loadError.description": "네트워크 설정을 확인하고 ChatGPT를 다시 시작하세요.",
  "loadError.reloadButton": "ChatGPT 다시 시작",
  "loadError.summary": "ChatGPT를 불러올 수 없습니다",
  "trayMenu.copyAppInfo": "앱 정보 복사: {summary}",
  "trayMenu.logout": "로그아웃",
  "trayMenu.openCompanionWindow": "컴패니언 창 열기",
  "trayMenu.openMainWindow": "ChatGPT 창 열기",
  "trayMenu.quit": "종료",
  "trayMenu.reload": "다시 불러오기",
  "webContextMenu.addToDictionary": "사전에 추가",
  "webContextMenu.copyImage": "이미지 복사",
  "webContextMenu.copyLink": "링크 복사",
  "webContextMenu.copyText": "복사",
  "webContextMenu.cutText": "잘라내기",
  "webContextMenu.pasteText": "붙여넣기",
  "webContextMenu.saveImageAs": "다른 이름으로 이미지 저장",
  "webContextMenu.selectAll": "모두 선택",
  "webContextMenu.showEmoji": "이모지",
  "webContextMenu.undoEdit": "실행 취소"
};
export {
  t as default
};
