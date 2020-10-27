console.log("niconico-Darkmode: version: v1.1.1")

function setting_true(){
  $('body').eq(0).addClass('ja-jp');
}
function setting_false(){
  $('body').eq(0).removeClass('ja-jp');
}

/*first start*/
var first_check_count = 0;
$(function(){
  if(!$('.staticHeader').length){
    var first_check = setInterval(function(){
      if(first_check_count == 0){
        if(!$('.common-header-nicodarksetting-but').length){
          $('.common-header-wb7b82').eq(0).prepend('<div class="common-header-nicodarksetting-but" style="position: relative;text-decoration: none;padding: 0px 8px;height: 36px;width: 60px;line-height: 36px;color: rgb(255, 255, 255);font-size: 12px;">🌙設定<div class="nicodark-setting-menupanel"><img class="nicodark-logo" src="https://github.com/AyumuNekozuki/niconico-darkmode/blob/master/ss/ss1.png?raw=true"><div class="nicodark-setting-menu"><label for="nicodark_setting_cb" class="nicodark-label01"><span class="nicodark-span01">総合TOP</span><label for="nicodark_setting_cb" id="nicodark-aria" class="nicodark-label02" aria-checked="false"><input type="checkbox" id="nicodark_setting_cb" class="nicodark-cb"><span class="nicodark-span02"></span></label></label></div><p style="margin: .25rem;padding: .25rem;font-size: 10px;line-height: 15px;border: .5px red dotted;">ネット超会議やボカコレなどのネットイベント用です。TOPページのデザインが崩れた場合にご利用ください。</p></div></div>');

          $('#nicodark_setting_cb').click(function() {
            var cb = $('#nicodark_setting_cb').prop('checked');
            if(cb){
              $('#nicodark-aria').removeAttr('aria-checked');
              $('#nicodark-aria').attr('aria-checked','true');
              chrome.storage.local.set({
                "setting" : "true"
              });
              setting_true();
            }else{
              $('#nicodark-aria').removeAttr('aria-checked');
              $('#nicodark-aria').attr('aria-checked','false');
              chrome.storage.local.set({
                "setting" : "false"
              });
              setting_false();
            }
          })

          chrome.storage.local.get(["setting"], function(items) {
            if(items.setting == "true"){
              document.getElementById("nicodark_setting_cb").checked = true;
              $('#nicodark-aria').removeAttr('aria-checked');
              $('#nicodark-aria').attr('aria-checked','true');
            }
          });
        }else{
          first_check_count = 1;
        }
      }else{
        clearTimeout(first_check);
      }
  },500);
  }
});

chrome.storage.local.get(["start_count"], function(items) {
  if(items.start_count == undefined){
    chrome.storage.local.set({
        "start_count": "1",
        "setting" : "true"
    });
    location.reload();
  };
    setting_true();
});

/*darkmode*/
chrome.storage.local.get(["setting"], function(items) {
  console.log("niconico-Darkmode: Setting: " + items.setting);
  if(items.setting == "true"){
    setting_true();
  }else{
    setting_false();
  }
});

