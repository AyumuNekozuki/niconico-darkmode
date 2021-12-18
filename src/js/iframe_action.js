//iframeで動くファイル

var is_darkmode = true;
chrome.storage.local.get(["setting"], function (items) {
  if (items.setting == "false") {
    is_darkmode = false;
    return is_darkmode;
  }
});

//読み込まれたら
window.addEventListener('load', function () {
  console.log("niconico Darkmode iframe　実行中です"); 

  //ダークモード適用
  if (is_darkmode) {
    nicodark_change_true();
  }
});

// 設定変更を受け取り
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse();

    if (request.change_settings == "nicodark_to_true") {
      is_darkmode = true;
      if (is_darkmode) {
        nicodark_change_true();
      }

    } else if (request.change_settings == "nicodark_to_false") {
      is_darkmode = false;
      nicodark_change_false();

    }

    return true;
  }
);


//ダークモード適用処理　定義
function nicodark_change_true() {
  while (!document.getElementsByTagName('body')[0].classList.contains('niconico-darkmode-setting-true')) {
    document.getElementsByTagName('body')[0].classList.add('niconico-darkmode-setting-true');
  }
}

//ダークモード解除処理　定義
function nicodark_change_false() {
  document.getElementsByClassName('niconico-darkmode-setting-true')[0].classList.remove('niconico-darkmode-setting-true');
}