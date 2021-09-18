

/*
ダークモード設定がONかチェックして、ONならばクラスを追加する
*/
function main_script() {
	chrome.storage.local.get(['setting'], function (items) {
		//デバッグメッセージ
		console.log('niconico-Darkmode: Setting: ' + items.setting);
		//有効かチェック
        if (items.setting == 'true') {
			//カラーパレットを置き換え
			recolorPalette();
			//黒カバー削除
            unset_cover();
            //クラスを追加
            add_extention_class();
		} else {
			//黒カバー削除
			unset_cover();
		}
	});
}

/*
置き換えが終わるまでの間の黒カバーを表示
*/
function unset_cover() {
    document.body.style.filter = 'brightness(1)';
}


/*
カラーパレットを置き換え
*/
function recolorPalette() {
	//styleタグの数だけ置き換えを実行
	const originalStyleElements = document.querySelectorAll('head style');
	originalStyleElements.forEach((e) => {
		//オリジナルのCSSを取得
        const orginalStyleContent = e.textContent;
        
		//カラーパレットの置き換え
		//置き換えしたものを再度置き換えないように、一時的に頭に@@をつけ、後ほど#に修正
		let recolor = orginalStyleContent;
		recolor = recolor.replaceAll('#000000', '@@FFFFFF'); //基礎反転
		recolor = recolor.replaceAll('#ffffff', '@@000000'); //基礎反転
		recolor = recolor.replaceAll('#252525', '@@FFFFFF');
		recolor = recolor.replaceAll('#fffef7', '@@000000'); //ページ背景色
		recolor = recolor.replaceAll('@@', '#');

		//オリジナルのCSSを置き換え
		e.textContent = recolor;
	});
}

/*
bodyにniconico-darkmode-setting-trueを追加
*/
function add_extention_class() {
	//クラスを追加
	const bodyElement = document.querySelector('body');
	bodyElement.classList.add('niconico-darkmode-setting-true');
}

//anime.jsを実行
main_script();