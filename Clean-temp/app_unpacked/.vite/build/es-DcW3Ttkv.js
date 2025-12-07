try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "98f6e836-6992-4497-8269-38c60a4fac26", e._sentryDebugIdIdentifier = "sentry-dbid-98f6e836-6992-4497-8269-38c60a4fac26");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Guardar como",
  "jumplist.openCompanionWindowDisplayName": "Abrir ventana auxiliar",
  "jumplist.quitDisplayName": "Salir de ChatGPT",
  "jumplist.reloadDisplayName": "Volver a cargar",
  "loadError.description": "Comprueba la configuración de tu red y prueba a reiniciar ChatGPT.",
  "loadError.reloadButton": "Reiniciar ChatGPT",
  "loadError.summary": "Imposible cargar ChatGPT",
  "trayMenu.copyAppInfo": "Copiar la información de la aplicación: {summary}",
  "trayMenu.logout": "Cerrar sesión",
  "trayMenu.openCompanionWindow": "Abrir ventana auxiliar",
  "trayMenu.openMainWindow": "Abrir la ventana de ChatGPT",
  "trayMenu.quit": "Salir",
  "trayMenu.reload": "Volver a cargar",
  "webContextMenu.addToDictionary": "Añadir al diccionario",
  "webContextMenu.copyImage": "Copiar imagen",
  "webContextMenu.copyLink": "Copiar enlace",
  "webContextMenu.copyText": "Copiar",
  "webContextMenu.cutText": "Cortar",
  "webContextMenu.pasteText": "Pegar",
  "webContextMenu.saveImageAs": "Guardar imagen como",
  "webContextMenu.selectAll": "Seleccionar todo",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Deshacer"
};
export {
  n as default
};
