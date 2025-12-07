try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "a8883ec1-ce03-4710-81b6-bbefd01a3034", e._sentryDebugIdIdentifier = "sentry-dbid-a8883ec1-ce03-4710-81b6-bbefd01a3034");
  })();
} catch {
}
const n = {
  "downloadManager.saveAsDialogTitle": "Guardar como",
  "jumplist.openCompanionWindowDisplayName": "Abrir la ventana del asistente",
  "jumplist.quitDisplayName": "Salir de ChatGPT",
  "jumplist.reloadDisplayName": "Volver a cargar",
  "loadError.description": "Comprueba la configuración de la red e intenta reiniciar ChatGPT.",
  "loadError.reloadButton": "Reiniciar ChatGPT",
  "loadError.summary": "No se puede cargar ChatGPT",
  "trayMenu.copyAppInfo": "Copiar la información de la aplicación: {summary}",
  "trayMenu.logout": "Cerrar sesión",
  "trayMenu.openCompanionWindow": "Abrir la ventana del asistente",
  "trayMenu.openMainWindow": "Abrir la ventana de ChatGPT",
  "trayMenu.quit": "Salir",
  "trayMenu.reload": "Volver a cargar",
  "webContextMenu.addToDictionary": "Agregar al diccionario",
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
