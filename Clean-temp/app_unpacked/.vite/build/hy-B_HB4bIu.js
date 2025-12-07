try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "b3c60c90-a239-4315-9761-a02b63a2586b", e._sentryDebugIdIdentifier = "sentry-dbid-b3c60c90-a239-4315-9761-a02b63a2586b");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Պահել որպես",
  "jumplist.openCompanionWindowDisplayName": "Բացել ուղեկից պատուհանում",
  "jumplist.quitDisplayName": "Դադարեցնել ChatGPT-ն",
  "jumplist.reloadDisplayName": "Կրկին բեռնել",
  "loadError.description": "Ստուգեք ձեր ցանցի կարգավորումները և փորձեք վերագործարկել ChatGPT-ն։",
  "loadError.reloadButton": "Վերագործարկել ChatGPT-ն",
  "loadError.summary": "ChatGPT-ն հնարավոր չէ բեռնել",
  "trayMenu.copyAppInfo": "Պատճենել հավելվածի տեղեկությունները՝ {summary}",
  "trayMenu.logout": "Դուրս գալ",
  "trayMenu.openCompanionWindow": "Բացել ուղեկից պատուհանում",
  "trayMenu.openMainWindow": "Բացել ChatGPT-ի պատուհանը",
  "trayMenu.quit": "Փակել",
  "trayMenu.reload": "Կրկին բեռնել",
  "webContextMenu.addToDictionary": "Ավելացնել բառարանում",
  "webContextMenu.copyImage": "Պատճենել պատկերը",
  "webContextMenu.copyLink": "Պատճենել հղումը",
  "webContextMenu.copyText": "Պատճենել",
  "webContextMenu.cutText": "Կտրել",
  "webContextMenu.pasteText": "Տեղադրել",
  "webContextMenu.saveImageAs": "Պահել պատկերը որպես",
  "webContextMenu.selectAll": "Ընտրել բոլորը",
  "webContextMenu.showEmoji": "Էմոջի",
  "webContextMenu.undoEdit": "Հետարկել"
};
export {
  t as default
};
