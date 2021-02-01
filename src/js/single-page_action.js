var i = "no";

chrome.storage.local.get(["version"], function (items) {
  console.log("niconico-Darkmode: version: " + items.version);
});

chrome.storage.local.get(["setting"], function (items) {
  console.log("niconico-Darkmode: Setting: " + items.setting);
  i = "yes";
  if(items.setting == "true"){
    $('body').eq(0).addClass('niconico-darkmode-setting-true');
  }
});

console.log("niconico-Darkmode: このページでは設定の切り替えはできません。");

$(document).ready( function(){
  if(i = "yes"){
    $('body').eq(0).addClass('niconico-darkmode-setting-true');
  }
});