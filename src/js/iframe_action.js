chrome.storage.local.get(["setting"], function (items) {
  if(items.setting == "true"){
    $('body').eq(0).addClass('niconico-darkmode-setting-true');
  }
});

console.log("niconico-Darkmode-iframe: 起動中です。");

