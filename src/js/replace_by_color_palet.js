
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
	/*
	styleタグの数だけ色をチェックし、置き換え対象とする色を決定する
	*/
	const originalStyleElements = document.querySelectorAll('head style');
	let backgroundColorTargetPalets = []; //検査で対象になった背景カラー
	let fontColorTargetPalets = []; //検査で対象になった背景カラー
	let borderColorTargetPalets = []; //検査で対象になった背景カラー
	originalStyleElements.forEach((e) => {
		console.log('styleタグ----------');
		//オリジナルのCSSを取得
		const orginalStyleContent = e.textContent;

		//背景色のカラーパレットを作成
		console.log('背景色検査--------');
		let returnColor = checkColor(
			/(background|background-color):(#[0-9A-Fa-f]{3,6}|rgba([0-9.]*,[0-9.]*,[0-9.]*,[0-9.]*)|rgb([0-9.]*,[0-9.]*,[0-9.]*));/g,
			orginalStyleContent,
			'background-color'
		);
		if (returnColor != undefined) {
			backgroundColorTargetPalets.push(returnColor);
		}
		//文字色のカラーパレットを作成
		console.log('文字色検査--------');
		returnColor = checkColor(
			/;color:(#[0-9A-Fa-f]{3,6}|rgba\([0-9\.]*,[0-9\.]*,[0-9\.]*,[0-9\.]*\)|rgb\([0-9\.]*,[0-9\.]*,[0-9\.]*\));/g,
			orginalStyleContent,
			'font-color'
		);
		if (returnColor != undefined) {
			fontColorTargetPalets.push(returnColor);
		}
		//線色のカラーパレットを作成
		console.log('線色検査--------');
		returnColor = checkColor(
			/border:[0-9]*px (solid|dotted) (#[0-9A-Fa-f]{3,6}|rgba\([0-9\.]*,[0-9\.]*,[0-9\.]*,[0-9\.]*\)|rgb\([0-9\.]*,[0-9\.]*,[0-9\.]*\));/g,
			orginalStyleContent,
			'border-color'
		);
		if (returnColor != undefined) {
			borderColorTargetPalets.push(returnColor);
		}
	});

	console.log('color check compleat!');
	console.log('------全ての背景色');
	backgroundColorTargetPalets = [
		...new Set(backgroundColorTargetPalets.map(JSON.stringify)),
	].map(JSON.parse); //重複削除
	console.log(backgroundColorTargetPalets);
	console.log('------全ての文字色');
	fontColorTargetPalets = [
		...new Set(fontColorTargetPalets.map(JSON.stringify)),
	].map(JSON.parse); //重複削除
	console.log(fontColorTargetPalets);
	console.log('------全ての線色');
	borderColorTargetPalets = [
		...new Set(borderColorTargetPalets.map(JSON.stringify)),
	].map(JSON.parse); //重複削除
	console.log(borderColorTargetPalets);
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



/*
RGBをhslに変換
from: https://note.kiriukun.com/entry/20181206-rgb-and-hsl-conversion
*/
function rgb2hsl(r, g, b) {
	const RGB_MAX = 255;
	const HUE_MAX = 360;
	const SATURATION_MAX = 100;
	const LIGHTNESS_MAX = 100;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l;

	// Hue
	const hp = HUE_MAX / 6;
	if (max == min) {
		h = 0;
	} else if (r == max) {
		h = hp * ((g - b) / (max - min));
	} else if (g == max) {
		h = hp * ((b - r) / (max - min)) + HUE_MAX / 3;
	} else {
		h = hp * ((r - g) / (max - min)) + (HUE_MAX * 2) / 3;
	}
	if (h < 0) {
		h += HUE_MAX;
	}

	// Saturation
	const cnt = (max + min) / 2;
	if (cnt < RGB_MAX / 2) {
		if (max + min <= 0) {
			s = 0;
		} else {
			s = ((max - min) / (max + min)) * SATURATION_MAX;
		}
	} else {
		s = ((max - min) / (RGB_MAX * 2 - max - min)) * SATURATION_MAX;
	}

	// Lightness
	l = ((max + min) / RGB_MAX / 2) * LIGHTNESS_MAX;

	let returnChannel = [];
	returnChannel[0] = h;
	returnChannel[1] = s;
	returnChannel[2] = l;
	return returnChannel;
};

/*
色検査のコア
*/
function checkColor(regix, orginalStyleContent, mode) {
	let propatys = orginalStyleContent.match(regix); //CSSからプロパティを抽出し、配列に格納
	//console.log(propatys);
	//該当のプロパティが含まれていれば処理を続行
	if (propatys != null) {
		let colorPalet = [];
		propatys.forEach((e) => {
			//色情報のみに再抽出
			colorPalet.push(
				e.match(
					/(#[0-9A-Fa-f]{3,6}|rgba\([0-9\.]*,[0-9\.]*,[0-9\.]*,[0-9\.]*\)|rgb\([0-9\.]*,[0-9\.]*,[0-9\.]*\))/g
				)[0]
			);
		});
		colorPalet = new Set(colorPalet); //配列の重複を削除
		//配列colorPaletを連想配列に
		let colorPaletDictionary = [];
		colorPalet.forEach((e) => {
			let tmp = {};
			tmp.comment = null;
			tmp.before = e;
			tmp.after = null;
			colorPaletDictionary.push(tmp)[0];
		});
		console.log(colorPaletDictionary);
		//colorPaletDictionaryの数だけ処理
		for (let i = 0; i < colorPaletDictionary.length; i++) {
			const now = colorPaletDictionary[i].before;
			console.log(
				'%c----' + now + '------------',
				'color:gray;background:' + now
			);
			let originalHsl;
			let originalAlpha;
			/*
			色指定を、一律にhslに変換
			*/
			if (now.match(/#.{3,6}/g)) {
				//hex to hsl
				if (now.match(/#.{3}$/g)) {
					//hex3 to hex6
					now =
						'#' +
						now.substring(1, 1) +
						now.substring(1, 1) +
						now.substring(2, 1) +
						now.substring(2, 1) +
						now.substring(3, 1) +
						now.substring(3, 1);
					console.log('covrt to hex8  = ' + now);
				}
				//RGBそれぞれを10進数に変換して配列に格納
				let colorChannel = [];
				colorChannel[0] = parseInt(now.substring(1, 2), 16); //R
				colorChannel[1] = parseInt(now.substring(3, 4), 16); //G
				colorChannel[2] = parseInt(now.substring(4, 6), 16); //B
				//変換とデータセット
				originalHsl = rgb2hsl(
					colorChannel[0],
					colorChannel[1],
					colorChannel[2]
				);
				originalAlpha = 1;
				console.log('convert from hex');
				console.log(originalHsl);
				console.log(originalAlpha);
			} else if (now.match(/#/g)) {
				//rgba to hsl
				//RGBそれぞれを配列に格納、Aは個別に格納
				const colorChannel = now.match(/\d/g);
				const alphaChannel = colorChannel[3];
				colorChannel.splice(3, 1); //alphaチャンネルをcoloeChannel配列から削除
				//変換とデータセット
				originalHsl = rgb2hsl(colorChannel);
				originalAlpha = alphaChannel;
				console.log('convert from rgba');
				console.log(originalHsl);
				console.log(originalAlpha);
			} else {
				//rgb to hsl
				//RGBそれぞれを配列に格納
				const colorChannel = now.match(/\d/g);
				//変換とデータセット
				originalHsl = rgb2hsl(colorChannel);
				originalAlpha = 1;
				console.log('convert from rgb');
				console.log(originalHsl);
				console.log(originalAlpha);
			}

			/*
			無彩色として扱うか決定

			彩度と輝度が50以下を無彩色と定義
			*/
			if (originalHsl[1] <= 50 || originalHsl[2] <= 50) {
				//無彩色
				let colorTargetPalet = {};
				colorTargetPalet.hsl = originalHsl;
				colorTargetPalet.alpha = originalAlpha;
				console.log('無彩色 この色のパレット↓');
				console.log(colorTargetPalet);
				return colorTargetPalet; //色を変更する対象に追加
			} else {
				//有彩色
				//特に何もしない
				console.log('有彩色');
			}
		}
	} else {
		console.log(mode + 'は無し');
	}
}