try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, a = new e.Error().stack;
    a && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[a] = "dd44beeb-bb72-45f5-966c-04afb4c0736a", e._sentryDebugIdIdentifier = "sentry-dbid-dd44beeb-bb72-45f5-966c-04afb4c0736a");
  })();
} catch {
}
const o = {
  "downloadManager.saveAsDialogTitle": "Salvar como",
  "jumplist.openCompanionWindowDisplayName": "Abrir janela de acompanhamento",
  "jumplist.quitDisplayName": "Sair do ChatGPT",
  "jumplist.reloadDisplayName": "Recarregar",
  "loadError.description": "Verifique as suas configurações de rede e tente reiniciar o ChatGPT.",
  "loadError.reloadButton": "Reiniciar ChatGPT",
  "loadError.summary": "Não foi possível carregar o ChatGPT",
  "trayMenu.copyAppInfo": "Copiar informações do aplicativo: {summary}",
  "trayMenu.logout": "Sair",
  "trayMenu.openCompanionWindow": "Abrir janela de acompanhamento",
  "trayMenu.openMainWindow": "Abrir janela do ChatGPT",
  "trayMenu.quit": "Fechar",
  "trayMenu.reload": "Recarregar",
  "webContextMenu.addToDictionary": "Adicionar ao dicionário",
  "webContextMenu.copyImage": "Copiar imagem",
  "webContextMenu.copyLink": "Copiar link",
  "webContextMenu.copyText": "Copiar",
  "webContextMenu.cutText": "Recortar",
  "webContextMenu.pasteText": "Colar",
  "webContextMenu.saveImageAs": "Salvar imagem como",
  "webContextMenu.selectAll": "Selecionar tudo",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Desfazer"
};
export {
  o as default
};
