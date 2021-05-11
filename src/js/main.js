//browser-extention
let manifestData = chrome.runtime.getManifest();

//バージョン
var ex_version = manifestData.version + "";

//URL取得
var host = location.hostname;
var path = location.pathname;
var now_location = host + path + "";

//ヘッダ除外ネーム
const noheader = [
  "account.nicovideo.jp/login",
  "www.nicovideo.jp/feedback",
  "live.nicovideo.jp/create",
  "live2.nicovideo.jp/create",
  "site.live.nicovideo.jp/recent/namagame.html"
]

function setting_true() {
  var true_do = setInterval(function () {
    $('body').eq(0).addClass('niconico-darkmode-setting-true');
    if ($('.niconico-darkmode-setting-true').length == true) {
      clearInterval(true_do);
    }
  }, 10)
}
function setting_false() {
  var false_do = setInterval(function () {
    $('body').eq(0).removeClass('niconico-darkmode-setting-true');
    if ($('.niconico-darkmode-setting-true').length == false) {
      clearInterval(false_do);
    }
  }, 10)
}

chrome.storage.local.get(["version"], function (items) {
  console.log("niconico-Darkmode: version: " + items.version);

  if ((items.version != ex_version)) {
    chrome.storage.local.set({
      "version": ex_version
    })
    chrome.storage.local.get(["setting"], function (items) {
      if (items.setting == undefined) {
        chrome.storage.local.set({
          "setting": "true"
        })
      }
    });
    setting_true();
  };
});

/*darkmode*/
chrome.storage.local.get(["setting"], function (items) {
  console.log("niconico-Darkmode: Setting: " + items.setting);
  if (items.setting == "true") {
    setting_true();

    //総合TOP
    if (now_location == "www.nicovideo.jp/") {
      chrome.storage.local.get(["social_top"], function (items) {
        console.log("niconico-Darkmode: social_top: " + items.social_top);
        if (items.social_top == "true") {
          setting_true();
        } else {
          setting_false();
        }
      });
    };

  } else {
    setting_false();
  }
});


/*first start*/
var first_check_count = 0;
$(function () {
  function headercheck(){
    if (!$('.staticHeader').length) {
      var first_check = setInterval(function () {
        if (first_check_count == 0) {
          if (!$('.common-header-nicodarksetting-but').length) {
            $('.common-header-wb7b82').eq(0).prepend('<div class="common-header-nicodarksetting-but" style="position: relative;text-decoration: none;padding: 0px 8px;height: 36px;width: 60px;line-height: 36px;color: rgb(255, 255, 255);font-size: 12px;">🌙設定<div class="nicodark-setting-menupanel"><img class="nicodark-logo" src="https://github.com/AyumuNekozuki/niconico-darkmode/blob/master/lib/ss/ss1.png?raw=true"><div class="nicodark-setting-menu"><label for="nicodark_setting_cb" class="nicodark-label01"><span class="nicodark-span01">ダークモード</span><label for="nicodark_setting_cb" id="nicodark-aria" class="nicodark-label02" aria-checked="false"><input type="checkbox" id="nicodark_setting_cb" class="nicodark-cb"><span class="nicodark-span02"></span></label></label><label for="nicodark_s_top-setting_cb" class="nicodark-label01"><span class="nicodark-span01">総合TOP（イベント時用）</span><label for="nicodark_s_top-setting_cb" id="nicodark-aria-s_top" class="nicodark-label02"><input type="checkbox" id="nicodark_s_top-setting_cb" class="nicodark-cb"><span class="nicodark-span02"></span></label></label></div><p class="nicodark-setting-version-telop">nicodark v'+ ex_version +'<a target="_blank" href="https://forms.gle/yZtasUR7hZGoCjtK8">Feedback</a></p></div></div>');

            //ダークモード
            $('#nicodark_setting_cb').click(function () {
              var cb = $('#nicodark_setting_cb').prop('checked');
              if (cb) {
                $('#nicodark-aria').removeAttr('aria-checked');
                $('#nicodark-aria').attr('aria-checked', 'true');
                chrome.storage.local.set({
                  "setting": "true"
                });
                setting_true();
              } else {
                $('#nicodark-aria').removeAttr('aria-checked');
                $('#nicodark-aria').attr('aria-checked', 'false');
                chrome.storage.local.set({
                  "setting": "false"
                });
                setting_false();
              }
            })

            //総合TOP
            $('#nicodark_s_top-setting_cb').click(function () {
              var cb = $('#nicodark_s_top-setting_cb').prop('checked');
              if (cb) {
                $('#nicodark-aria-s_top').removeAttr('aria-checked');
                $('#nicodark-aria-s_top').attr('aria-checked', 'true');
                chrome.storage.local.set({
                  "social_top": "true"
                });
                if (now_location == "www.nicovideo.jp/") {
                  setting_true();
                }
              } else {
                $('#nicodark-aria-s_top').removeAttr('aria-checked');
                $('#nicodark-aria-s_top').attr('aria-checked', 'false');
                chrome.storage.local.set({
                  "social_top": "false"
                });

                var host = location.hostname;
                var path = location.pathname;
                if ((host == "www.nicovideo.jp") && ((path == "/") || (path == "/*"))) {
                  setting_false();
                }
              }
            })

            chrome.storage.local.get(["setting"], function (items) {
              if (items.setting == "true") {
                document.getElementById("nicodark_setting_cb").checked = true;
                $('#nicodark-aria').removeAttr('aria-checked');
                $('#nicodark-aria').attr('aria-checked', 'true');
              }
            });
            chrome.storage.local.get(["social_top"], function (items) {
              if (items.social_top == "true") {
                document.getElementById("nicodark_s_top-setting_cb").checked = true;
                $('#nicodark-aria-s_top').removeAttr('aria-checked');
                $('#nicodark-aria-s_top').attr('aria-checked', 'true');
              }
            });
          } else {
            first_check_count = 1;
          }
        } else {
          clearTimeout(first_check);
        }
      }, 500);
    }
  }
  if(!(noheader.includes(now_location))){
    headercheck();
  }
});
