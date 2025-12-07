try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "08dde05e-8ecb-417b-9194-30d88550dbb1", e._sentryDebugIdIdentifier = "sentry-dbid-08dde05e-8ecb-417b-9194-30d88550dbb1");
  })();
} catch {
}
const o = {
  "downloadManager.saveAsDialogTitle": "Guardar como",
  "jumplist.openCompanionWindowDisplayName": "Abrir a janela suplementar",
  "jumplist.quitDisplayName": "Sair do ChatGPT",
  "jumplist.reloadDisplayName": "Voltar a carregar",
  "loadError.description": "Verifique as suas definições de rede e tente reiniciar o ChatGPT.",
  "loadError.reloadButton": "Reiniciar ChatGPT",
  "loadError.summary": "Não é possível carregar o ChatGPT",
  "trayMenu.copyAppInfo": "Copiar informações da app: {summary}",
  "trayMenu.logout": "Terminar sessão",
  "trayMenu.openCompanionWindow": "Abrir a janela suplementar",
  "trayMenu.openMainWindow": "Abrir a janela do ChatGPT",
  "trayMenu.quit": "Sair",
  "trayMenu.reload": "Voltar a carregar",
  "webContextMenu.addToDictionary": "Adicionar ao dicionário",
  "webContextMenu.copyImage": "Copiar imagem",
  "webContextMenu.copyLink": "Copiar ligação",
  "webContextMenu.copyText": "Copiar",
  "webContextMenu.cutText": "Cortar",
  "webContextMenu.pasteText": "Colar",
  "webContextMenu.saveImageAs": "Guardar imagem como",
  "webContextMenu.selectAll": "Selecionar tudo",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Anular"
};
export {
  o as default
};
