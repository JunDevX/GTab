const api = typeof browser !== 'undefined' ? browser : chrome;

api.action.onClicked.addListener(function () {
  api.runtime.openOptionsPage();
});

api.runtime.onInstalled.addListener(function (details) {
  if (details && details.reason === 'install') api.runtime.openOptionsPage();
});
