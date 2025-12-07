try {
  (function() {
    var e = typeof window < "u" ? window : typeof global < "u" ? global : typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : {}, n = new e.Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0770ed46-e95e-46e9-946d-5ab85e34aa98", e._sentryDebugIdIdentifier = "sentry-dbid-0770ed46-e95e-46e9-946d-5ab85e34aa98");
  })();
} catch {
}
const t = {
  "downloadManager.saveAsDialogTitle": "Enregistrer sous",
  "jumplist.openCompanionWindowDisplayName": "Ouvrir la fenêtre compagnon",
  "jumplist.quitDisplayName": "Quitter ChatGPT",
  "jumplist.reloadDisplayName": "Recharger",
  "loadError.description": "Vérifiez vos paramètres réseau et essayez de redémarrer ChatGPT.",
  "loadError.reloadButton": "Redémarrer ChatGPT",
  "loadError.summary": "Impossible de charger ChatGPT",
  "trayMenu.copyAppInfo": "Copier les informations de l’appli : {summary}",
  "trayMenu.logout": "Se déconnecter",
  "trayMenu.openCompanionWindow": "Ouvrir la fenêtre compagnon",
  "trayMenu.openMainWindow": "Ouvrir la fenêtre ChatGPT",
  "trayMenu.quit": "Quitter",
  "trayMenu.reload": "Recharger",
  "webContextMenu.addToDictionary": "Ajouter au dictionnaire",
  "webContextMenu.copyImage": "Copier l’image",
  "webContextMenu.copyLink": "Copier le lien",
  "webContextMenu.copyText": "Copier",
  "webContextMenu.cutText": "Couper",
  "webContextMenu.pasteText": "Coller",
  "webContextMenu.saveImageAs": "Enregistrer l’image sous",
  "webContextMenu.selectAll": "Sélectionner tout",
  "webContextMenu.showEmoji": "Emoji",
  "webContextMenu.undoEdit": "Annuler"
};
export {
  t as default
};
