var getPageTitle = document.title;

const maintenance = ["ただいまメンテナンス中です。 - ニコニコ生放送"];

if(getPageTitle.includes(maintenance)){
  chrome.storage.local.get(["setting"], function (items) {
    if(items.setting == "true"){
      $('body').eq(0).addClass('niconico-darkmode-maintenance');
    }
  });
}