var i = "no";

chrome.storage.local.get(["setting"], function (items) {
  if(items.setting == "true"){
    i = "yes";
    $('body').eq(0).addClass('niconico-darkmode-setting-true');
  }
});

console.log("niconico-Darkmode-iframe: 起動中です。");

/*例外*/
if(i="yes"){
  var host = location.hostname;
  var path = location.pathname;
  var now_location = host + path + "";
  if(now_location = "https://site.nicovideo.jp/badge/"){
    $('body').eq(0).addClass('niconico-darkmode-setting-true');
  }
}

