//メインで動くファイル

//拡張機能 情報取得
const MANIFEST_DATA = chrome.runtime.getManifest();
const EX_VERSION = MANIFEST_DATA.version + "";
let is_darkmode = true;
let is_socialtop = true;
let isset_osdarkmode = false;

let os_darkmode = window.matchMedia('(prefers-color-scheme: dark)');

console.log("niconico Darkmode　実行中です\n" + "　　Version: v" + EX_VERSION);

//設定取得
chrome.storage.local.get(["setting", "social_top", "set_osdarkmode"], function (items) {
  if (items.setting == "false") {
    is_darkmode = false;
    return is_darkmode;
  }
  if (items.social_top == "false") {
    is_socialtop = false;
    return is_socialtop;
  }
  if (items.set_osdarkmode == "true"){
    isset_osdarkmode = true;
    os_darkmode.addEventListener('change', nicodark_set_osdarkmode, true);
    return isset_osdarkmode;
  }
});

//現在URL取得
var host = location.hostname;
var path = location.pathname;
var now_location = host + path + "";



//bodyタグが読まれたら変更させる監視
let is_body_observe = false;
var body_observer = new MutationObserver(function (mutationList, observer) {
  if (document.body === null) {
    return;
  }
  body_observer.disconnect();
  is_body_observe = true;

  //ダークモード
  check_nicodarksettings();
});
body_observer.observe(document.documentElement, {childList: true});

//設定情報の取得状態を監視
var setting_observe = setInterval(() => {
  //設定がfalseの時解除
  if(is_body_observe){
    if(!is_darkmode){
      nicodark_change_false();
      clearInterval(setting_observe);

    }else if(!is_socialtop && (now_location == "www.nicovideo.jp/")){
      nicodark_change_false();
      clearInterval(setting_observe);

    }else if(isset_osdarkmode && (os_darkmode.matches == false)){
      nicodark_change_false();
      clearInterval(setting_observe);
    }
  }
}, 100);
//5秒で自動的に監視STOP
setTimeout(() => {
  clearInterval(setting_observe);
}, 5000);


// 設定変更を受け取り
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    sendResponse();

    if (request.change_settings == "nicodark_to_true") {
      is_darkmode = true;
      if (is_darkmode && is_socialtop && !isset_osdarkmode) {
        nicodark_change_true();
      } else if (is_darkmode && !is_socialtop && !(now_location == "www.nicovideo.jp/") && !isset_osdarkmode) {
        nicodark_change_true();
      }

    } else if (request.change_settings == "nicodark_to_false") {
      is_darkmode = false;
      if(!isset_osdarkmode){
        nicodark_change_false();
      }

    } else if (request.change_settings == "nicodark_top_to_true") {
      is_socialtop = true;
      if (now_location == "www.nicovideo.jp/" && !isset_osdarkmode) {
        nicodark_change_true();
      }

    } else if (request.change_settings == "nicodark_top_to_false") {
      is_socialtop = false;
      if (now_location == "www.nicovideo.jp/" && !isset_osdarkmode) {
        nicodark_change_false();
      }

    } else if (request.change_settings == "nicodark_osset_to_true") {
      isset_osdarkmode = true;
      os_darkmode.addEventListener('change', nicodark_set_osdarkmode, true);
      if(os_darkmode.matches == true){
        nicodark_change_true();
    
      }else if(os_darkmode.matches == false){
        nicodark_change_false();
      }
      

    } else if (request.change_settings == "nicodark_osset_to_false") {
      isset_osdarkmode = false;
      os_darkmode.removeEventListener('change', nicodark_set_osdarkmode, true); 

      if(is_darkmode && is_socialtop){
        nicodark_change_true();
      }else if(is_darkmode && !is_socialtop && !(now_location == "www.nicovideo.jp/")){
        nicodark_change_true();
      }else{
        nicodark_change_false();
      }
      
    }

    return true;
  }
);

//ダークモード実行判定処理
function check_nicodarksettings(){
  if (is_darkmode && is_socialtop) {
    nicodark_change_true();
  } else if (is_darkmode && !is_socialtop && !(now_location == "www.nicovideo.jp/")) {
    nicodark_change_true();
  } else if (isset_osdarkmode == true && os_darkmode.matches == true){
    nicodark_change_true();
  }
}

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

//OSダークモードの取得を検知
function nicodark_set_osdarkmode(e) {
  if(e.matches){
    nicodark_change_true();
  }else{
    nicodark_change_false();
  }
}