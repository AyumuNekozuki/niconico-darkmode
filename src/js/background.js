//バックグラウンドで動くファイル

//拡張機能 情報取得
const MANIFEST_DATA = chrome.runtime.getManifest();
const EX_VERSION = MANIFEST_DATA.version + "";

// 初期化・設定同期
chrome.runtime.onInstalled.addListener(function() {
  console.log("first script")
  chrome.storage.local.get(["version"], function (items) {
    //バージョンが違ったらセット
    if (items.version != EX_VERSION) {
      chrome.storage.local.set({
        "version": EX_VERSION
      });
      chrome.storage.local.get(["setting"], function (items) {
        if (items.setting == undefined) {
          chrome.storage.local.set({
            "setting": "true"
          })
        }
      });
      chrome.storage.local.get(["social_top"], function (items) {
        if (items.social_top == undefined) {
          chrome.storage.local.set({
            "social_top": "true"
          })
        }
      });
    };
  });
});

// 設定変更リクエストの受け取り　ページ → 拡張機能
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log(request.request_change_settings);
    change_settings(request.request_change_settings);
    sendResponse({ farewell: "niconico Darkmode 設定変更を受け付けました" });
    return true;
  }
);


// 設定変更　拡張機能 → ストレージ
function change_settings(request_setting_param) {
  switch (request_setting_param) {
    case "req_nicodark_to_true":
      chrome.storage.local.set({
        "setting": "true"
      });
      send_change_settings("nicodark_to_true");
      break;

    case "req_nicodark_to_false":
      chrome.storage.local.set({
        "setting": "false"
      });
      send_change_settings("nicodark_to_false");
      break;

    case "req_nicodark_top_to_true":
      chrome.storage.local.set({
        "social_top": "true"
      });
      send_change_settings("nicodark_top_to_true");
      break;

    case "req_nicodark_top_to_false":
      chrome.storage.local.set({
        "social_top": "false"
      });
      send_change_settings("nicodark_top_to_false");
      break;

    default:
      break;
  }
}


// 設定反映 拡張機能 →　ページ
function send_change_settings(send_setting_param) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {change_settings: send_setting_param}, function(){});
  });
}
