//メインで動くファイル

//拡張機能 情報取得
const MANIFEST_DATA = chrome.runtime.getManifest();
const EX_VERSION = MANIFEST_DATA.version + "";
var is_darkmode = true;
var is_socialtop = true;

chrome.storage.local.get(["setting"], function (items) {
  if (items.setting == "false") {
    is_darkmode = false;
    return is_darkmode;
  }
});
chrome.storage.local.get(["social_top"], function (items) {
  if (items.social_top == "false") {
    is_socialtop = false;
    return is_socialtop;
  }
});

//現在URL取得
var host = location.hostname;
var path = location.pathname;
var now_location = host + path + "";

//読み込まれたら実行
window.addEventListener('DOMContentLoaded', function () {
  console.log("niconico Darkmode　実行中です\n" + "　　Version: v" + EX_VERSION + "\n" + "　　Setting: " + is_darkmode + "\n" + "　　SocialTop: " + is_socialtop);

  //ダークモード適用
  if (is_darkmode && is_socialtop) {
    nicodark_change_true();
  } else if (is_darkmode && !is_socialtop && !(now_location == "www.nicovideo.jp/")) {
    nicodark_change_true();
  }
});


// 設定変更を受け取り
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse();

    if (request.change_settings == "nicodark_to_true") {
      is_darkmode = true;
      if (is_darkmode && is_socialtop) {
        nicodark_change_true();
      } else if (is_darkmode && !is_socialtop && !(now_location == "www.nicovideo.jp/")) {
        nicodark_change_true();
      }
      //以下後日削除
      nicodark_setting_cb.checked = true;
      nicodark_aria.setAttribute('aria-checked', 'true');

    } else if (request.change_settings == "nicodark_to_false") {
      is_darkmode = false;
      nicodark_change_false();
      //以下後日削除
      nicodark_setting_cb.checked = false;
      nicodark_aria.setAttribute('aria-checked', 'false');

    } else if (request.change_settings == "nicodark_top_to_true") {
      is_socialtop = true;
      if (now_location == "www.nicovideo.jp/") {
        nicodark_change_true();
      }
      //以下後日削除
      nicodark_setting_cb_s_top.checked = true;
      nicodark_aria_s_top.setAttribute('aria-checked', 'true');

    } else if (request.change_settings == "nicodark_top_to_false") {
      is_socialtop = false;
      if (now_location == "www.nicovideo.jp/") {
        nicodark_change_false();
      }
      //以下後日削除
      nicodark_setting_cb_s_top.checked = false;
      nicodark_aria_s_top.setAttribute('aria-checked', 'false');
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
