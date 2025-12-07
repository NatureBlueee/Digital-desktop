try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "3d67070e-f343-4166-8a33-ba039395972b", e._sentryDebugIdIdentifier = "sentry-dbid-3d67070e-f343-4166-8a33-ba039395972b");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "შეინახე, როგორც…",
  "jumplist.openCompanionWindowDisplayName": "მცოცავი ფანჯრის გახსნა",
  "jumplist.quitDisplayName": "ChatGPT-ს დახურვა",
  "jumplist.reloadDisplayName": "ხელახლა ჩატვირთვა",
  "loadError.description": "შეამოწმეთ ინტერნეტთან კავშირი და გადატვირთეთ ChatGPT.",
  "loadError.reloadButton": "ChatGPT-ს გადატვირთვა",
  "loadError.summary": "ChatGPT-ს ჩატვირთვა ვერ ხერხდება",
  "trayMenu.copyAppInfo": "აპლიკაციის ინფორმაციის კოპირება: {summary}",
  "trayMenu.logout": "გამოსვლა",
  "trayMenu.openCompanionWindow": "მცოცავი ფანჯრის გახსნა",
  "trayMenu.openMainWindow": "ChatGPT-ს ფანჯრის გახსნა",
  "trayMenu.quit": "დახურვა",
  "trayMenu.reload": "ხელახლა ჩატვირთვა",
  "webContextMenu.addToDictionary": "ლექსიკონში დამატება",
  "webContextMenu.copyImage": "სურათის კოპირება",
  "webContextMenu.copyLink": "ბმულის კოპირება",
  "webContextMenu.copyText": "კოპირება",
  "webContextMenu.cutText": "ამოჭრა",
  "webContextMenu.pasteText": "ჩასმა",
  "webContextMenu.saveImageAs": "შეინახე სურათი, როგორც…",
  "webContextMenu.selectAll": "ყველას არჩევა",
  "webContextMenu.showEmoji": "ემოჯი",
  "webContextMenu.undoEdit": "მოქმედების გაუქმება"
};
export {
  t as default
};
