// browser_acticon 周りの表示系等ファイル


//拡張機能 情報取得
//chrome.storageに突っ込むと文字列化されるので、面倒なので最初から文字列として定義しておく
let is_darkmode = "true";
let is_socialtop = "true";
let isset_osdarkmode = "false";
const MANIFEST_DATA = chrome.runtime.getManifest();
const EX_VERSION = MANIFEST_DATA.version + "";

//読み込まれたら実行
window.onload = function(){

  //全体 ボタン
  let nicodark_setting_cb = document.getElementById("nicodark_setting_cb");
  let nicodark_aria = document.getElementById("nicodark-aria");

  //総合TOP ボタン
  let nicodark_setting_cb_s_top = document.getElementById("nicodark_s_top-setting_cb");
  let nicodark_aria_s_top = document.getElementById("nicodark-aria-s_top");

  //OS設定と合わせる ボタン
  let nicodark_set_os_settings_cb = document.getElementById("nicodark_set_os_settings_cb");
  let nicodark_aria_set_os_settings = document.getElementById("nicodark-aria-set_os_settings");

  //バージョン表示 
  document.getElementById("show_version").textContent = "nicodark v" + EX_VERSION;

  //設定反映
  //本当は先に取得して保持しておいてそれを使いたかったがレスポンスが遅かったのでここで実行
  chrome.storage.local.get(["setting"], function (items) {
    is_darkmode = items.setting;

    if(items.setting === "false"){
      nicodark_setting_cb.checked = false;
      nicodark_aria.setAttribute('aria-checked', 'false');
    }else{
      nicodark_setting_cb.checked = true;
      nicodark_aria.setAttribute('aria-checked', 'true');
    }

    return is_darkmode;
  });
  chrome.storage.local.get(["social_top"], function (items) {
    is_socialtop = items.social_top;

    if(items.social_top === "false"){
      nicodark_setting_cb_s_top.checked = false;
      nicodark_aria_s_top.setAttribute('aria-checked', 'false');
    }else{
      nicodark_setting_cb_s_top.checked = true;
      nicodark_aria_s_top.setAttribute('aria-checked', 'true');
    }

    return is_socialtop;
  });

  chrome.storage.local.get(["set_osdarkmode"], function (items) {
    isset_osdarkmode = items.set_osdarkmode;

    if(items.set_osdarkmode === "false"){
      nicodark_set_os_settings_cb.checked = false;
      nicodark_aria_set_os_settings.setAttribute('aria-checked', 'false');
    }else{
      nicodark_set_os_settings_cb.checked = true;
      nicodark_aria_set_os_settings.setAttribute('aria-checked', 'true');
    }

    return isset_osdarkmode;
  });

  //設定変更時処理　メッセージ送信
  nicodark_setting_cb.onclick = function(){
    if(is_darkmode === "false"){
      chrome.runtime.sendMessage({request_change_settings: "req_nicodark_to_true"}, function(response) {
        console.log(response.farewell);
      });
      nicodark_setting_cb.checked = true;
      nicodark_aria.setAttribute('aria-checked', 'true');
      is_darkmode = "true";

    }else if(is_darkmode === "true"){
      chrome.runtime.sendMessage({request_change_settings: "req_nicodark_to_false"}, function(response) {
        console.log(response.farewell);
      });
      nicodark_setting_cb.checked = false;
      nicodark_aria.setAttribute('aria-checked', 'false');
      is_darkmode = "false";
    }
  }
  
  nicodark_setting_cb_s_top.onclick = function(){
    if(is_socialtop === "false"){
      chrome.runtime.sendMessage({request_change_settings: "req_nicodark_top_to_true"}, function(response) {
        console.log(response.farewell);
      });
      nicodark_setting_cb_s_top.checked = true;
      nicodark_aria_s_top.setAttribute('aria-checked', 'true');
      is_socialtop = "true";

    }else if(is_socialtop === "true"){
      chrome.runtime.sendMessage({request_change_settings: "req_nicodark_top_to_false"}, function(response) {
        console.log(response.farewell);
      });
      nicodark_setting_cb_s_top.checked = false;
      nicodark_aria_s_top.setAttribute('aria-checked', 'false');
      is_socialtop = "false";
    }
  }

  nicodark_set_os_settings_cb.onclick = function(){
    if(isset_osdarkmode === "false"){
      chrome.runtime.sendMessage({request_change_settings: "req_nicodark_osset_to_true"}, function(response) {
        console.log(response.farewell);
      });
      nicodark_set_os_settings_cb.checked = true;
      nicodark_aria_set_os_settings.setAttribute('aria-checked', 'true');
      isset_osdarkmode = "true";

    }else if(isset_osdarkmode === "true"){
      chrome.runtime.sendMessage({request_change_settings: "req_nicodark_osset_to_false"}, function(response) {
        console.log(response.farewell);
      });
      nicodark_set_os_settings_cb.checked = false;
      nicodark_aria_set_os_settings.setAttribute('aria-checked', 'false');
      isset_osdarkmode = "false";
    }
  }
}


