try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, t = new e.Error().stack;
    t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "3a5fcbb6-f1af-4d8b-a34e-da8bb10c1de8", e._sentryDebugIdIdentifier = "sentry-dbid-3a5fcbb6-f1af-4d8b-a34e-da8bb10c1de8");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "บันทึกเป็น",
  "jumplist.openCompanionWindowDisplayName": "เปิดหน้าจอรอง",
  "jumplist.quitDisplayName": "ออกจาก ChatGPT",
  "jumplist.reloadDisplayName": "โหลดซ้ำ",
  "loadError.description": "ตรวจสอบการตั้งค่าเครือข่ายของคุณแล้วลองเริ่มใช้งาน ChatGPT อีกครั้ง",
  "loadError.reloadButton": "รีสตาร์ท ChatGPT",
  "loadError.summary": "ไม่สามารถโหลด ChatGPT ได้",
  "trayMenu.copyAppInfo": "คัดลอกข้อมูลแอป: {summary}",
  "trayMenu.logout": "ลงชื่อออก",
  "trayMenu.openCompanionWindow": "เปิดหน้าจอรอง",
  "trayMenu.openMainWindow": "เปิดหน้าต่าง ChatGPT",
  "trayMenu.quit": "ออก",
  "trayMenu.reload": "โหลดซ้ำ",
  "webContextMenu.addToDictionary": "เพิ่มเข้าพจนานุกรม",
  "webContextMenu.copyImage": "คัดลอกภาพ",
  "webContextMenu.copyLink": "คัดลอกลิงก์",
  "webContextMenu.copyText": "คัดลอก",
  "webContextMenu.cutText": "ตัด",
  "webContextMenu.pasteText": "วาง",
  "webContextMenu.saveImageAs": "บันทึกภาพเป็น",
  "webContextMenu.selectAll": "เลือกทั้งหมด",
  "webContextMenu.showEmoji": "อีโมจิ",
  "webContextMenu.undoEdit": "เลิกทำ"
};
export {
  n as default
};
