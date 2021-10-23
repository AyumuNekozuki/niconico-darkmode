//メインで動くファイル


//ヘッダーが無いページ＆もろもろ事前定義　後日削除
const NOHEADER_PAGES = [
  "account.nicovideo.jp/login",
  "www.nicovideo.jp/feedback",
  "live.nicovideo.jp/create",
  "live2.nicovideo.jp/create",
  "site.live.nicovideo.jp/recent/namagame.html",
  "commons.nicovideo.jp/cpp/private/receipt/"
];
const NOHEADER_HOSTS = [
  "www.upload.nicovideo.jp",
  "jk.nicovideo.jp"
];

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


// ヘッダーメニュー実行
// 後日以下 削除

window.onload = function () {
  if (!(NOHEADER_PAGES.includes(now_location)) && !(NOHEADER_HOSTS.includes(host))) {
    add_settingmenu_header();
  }
};

let header_settingmenu = '<div id="nicodark_setting_menu" class="common-header-nicodarksetting-but">設定<div class="nicodark-setting-menupanel"><img class="nicodark-logo" src="https://github.com/AyumuNekozuki/niconico-darkmode/blob/master/lib/ss/ss1.png?raw=true"><div class="nicodark-setting-menu"><p class="onelineinfo">次回以降のアップデートで<br>ブラウザ右上のアクションボタンに<br>設定パネルが移動します</p><label for="nicodark_setting_cb" class="nicodark-label01"><span class="nicodark-span01">ダークモード</span><label for="nicodark_setting_cb" id="nicodark-aria" class="nicodark-label02" aria-checked="false"><input type="checkbox" id="nicodark_setting_cb" class="nicodark-cb"><span class="nicodark-span02"></span></label></label><label for="nicodark_s_top-setting_cb" class="nicodark-label01"><span class="nicodark-span01">総合TOP（イベント時用）</span><label for="nicodark_s_top-setting_cb" id="nicodark-aria-s_top" class="nicodark-label02"><input type="checkbox" id="nicodark_s_top-setting_cb" class="nicodark-cb"><span class="nicodark-span02"></span></label></label></div><p class="nicodark-setting-version-telop">nicodark v' + EX_VERSION + '<a target="_blank" href="https://forms.gle/z2tLcyxsCBz5X81TA">Feedback</a></p></div></div>';


function add_settingmenu_header() {
  while (!document.getElementById('nicodark_setting_menu')) {
    if (!document.getElementsByClassName('common-header-wb7b82')[0]) {
      continue;
    }
    document.getElementsByClassName('common-header-wb7b82')[0].insertAdjacentHTML('afterbegin', header_settingmenu);

    //全体 ボタン
    const nicodark_setting_cb = document.getElementById("nicodark_setting_cb");
    const nicodark_aria = document.getElementById("nicodark-aria");

    //総合TOP ボタン
    const nicodark_setting_cb_s_top = document.getElementById("nicodark_s_top-setting_cb");
    const nicodark_aria_s_top = document.getElementById("nicodark-aria-s_top");

    //設定反映
    if (is_darkmode == false) {
      nicodark_setting_cb.checked = false;
      nicodark_aria.setAttribute('aria-checked', 'false');
    } else {
      nicodark_setting_cb.checked = true;
      nicodark_aria.setAttribute('aria-checked', 'true');
    }
    if (is_socialtop == false) {
      nicodark_setting_cb_s_top.checked = false;
      nicodark_aria_s_top.setAttribute('aria-checked', 'false');
    } else {
      nicodark_setting_cb_s_top.checked = true;
      nicodark_aria_s_top.setAttribute('aria-checked', 'true');
    }

    //設定変更時処理　メッセージ送信
    nicodark_setting_cb.onclick = function () {
      if (is_darkmode == false) {
        chrome.runtime.sendMessage({ request_change_settings: "req_nicodark_to_true" }, function (response) {
          console.log(response.farewell);
        });
        nicodark_setting_cb.checked = true;
        nicodark_aria.setAttribute('aria-checked', 'true');

      } else if (is_darkmode == true) {
        chrome.runtime.sendMessage({ request_change_settings: "req_nicodark_to_false" }, function (response) {
          console.log(response.farewell);
        });
        nicodark_setting_cb.checked = false;
        nicodark_aria.setAttribute('aria-checked', 'false');
      }
    }

    nicodark_setting_cb_s_top.onclick = function () {
      if (is_socialtop == false) {
        chrome.runtime.sendMessage({ request_change_settings: "req_nicodark_top_to_true" }, function (response) {
          console.log(response.farewell);
        });
        nicodark_setting_cb_s_top.checked = true;
        nicodark_aria_s_top.setAttribute('aria-checked', 'true');

      } else if (is_socialtop == true) {
        chrome.runtime.sendMessage({ request_change_settings: "req_nicodark_top_to_false" }, function (response) {
          console.log(response.farewell);
        });
        nicodark_setting_cb_s_top.checked = false;
        nicodark_aria_s_top.setAttribute('aria-checked', 'false');
      }
    }
  }

}
