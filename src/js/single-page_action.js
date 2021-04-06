var host = location.hostname + "";
if(host == "jk.nicovideo.jp"){
  single_page_action();
  setTimeout(single_page_action, 200);
}else{
  single_page_action();
}

function single_page_action() {
  chrome.storage.local.get(["version"], function (items) {
    console.log("niconico-Darkmode: version: " + items.version);
  });
  
  chrome.storage.local.get(["setting"], function (items) {
    console.log("niconico-Darkmode: Setting: " + items.setting);
    if(items.setting == "true"){
      $('body').eq(0).addClass('niconico-darkmode-setting-true');
    }
  });
}


console.log("niconico-Darkmode: このページでは設定の切り替えはできません。");