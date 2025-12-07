try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "78616038-1459-4ee1-9df3-08469c9126b5", e._sentryDebugIdIdentifier = "sentry-dbid-78616038-1459-4ee1-9df3-08469c9126b5");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Enregistrer sous",
  "jumplist.openCompanionWindowDisplayName": "Ouvrir la fenêtre d’accompagnement",
  "jumplist.quitDisplayName": "Quitter ChatGPT",
  "jumplist.reloadDisplayName": "Rafraîchir",
  "loadError.description": "Vérifiez les paramètres de votre réseau et essayez de redémarrer ChatGPT.",
  "loadError.reloadButton": "Redémarrer ChatGPT",
  "loadError.summary": "Impossible de charger ChatGPT",
  "trayMenu.copyAppInfo": "Copier l’info de l’appli : {summary}",
  "trayMenu.logout": "Déconnexion",
  "trayMenu.openCompanionWindow": "Ouvrir la fenêtre d’accompagnement",
  "trayMenu.openMainWindow": "Ouvrir une fenêtre ChatGPT",
  "trayMenu.quit": "Quitter",
  "trayMenu.reload": "Rafraîchir",
  "webContextMenu.addToDictionary": "Ajouter au dictionnaire",
  "webContextMenu.copyImage": "Copier l’image",
  "webContextMenu.copyLink": "Copier le lien",
  "webContextMenu.copyText": "Copier",
  "webContextMenu.cutText": "Couper",
  "webContextMenu.pasteText": "Coller",
  "webContextMenu.saveImageAs": "Enregistrer l’image sous",
  "webContextMenu.selectAll": "Sélectionner tout",
  "webContextMenu.showEmoji": "Émoji",
  "webContextMenu.undoEdit": "Annuler"
};
export {
  t as default
};
