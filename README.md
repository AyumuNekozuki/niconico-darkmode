![](https://img.shields.io/github/license/AyumuNekozuki/niconico-darkmode) 

![](https://img.shields.io/chrome-web-store/v/gihjpgjpgofigjcckobchfchlfbhenjl) ![](https://img.shields.io/chrome-web-store/users/gihjpgjpgofigjcckobchfchlfbhenjl) ![](https://img.shields.io/amo/v/niconico-darkmode) ![](https://img.shields.io/amo/users/niconico-darkmode)

![](/lib/ss/lib/ss1.png)

niconicoサイトをダークモード化する拡張機能です。

▼ DLはこちらから
- [Chrome Web Store](https://chrome.google.com/webstore/detail/niconico-darkmode/gihjpgjpgofigjcckobchfchlfbhenjl)
- [Firefox Add-ons](https://addons.mozilla.org/ja/firefox/addon/niconico-darkmode/)


## Preview

![niconico総合TOP](/lib/ss/002.png)

---

## 必要条件
以下のいずれかを利用して開発に参加することができます。
- Google Chrome 最新版
- Mozilla Firefox 最新版

（どちらもOSは問わないが最新のものであることが条件）

## 使用言語 / 技術
- SCSS
- CSS3
- javascript
- jQuery
- Docker / Docker-compose（ソースファイルのコンパイルに必要）

## 開発への参加
### 環境構築(Chrome)
1. 最新のリポジトリをDL
2. dockerとdocker-composeの実行環境を用意
3. [拡張機能の管理](chrome://extensions/)からデベロッパーモードを有効化
4. gitのルートディレクトリで`docker-compose up -d`を実行しコンパイルを実行
5. `dest`読み込み編集

### 環境構築(Firefox)
1. 最新のリポジトリをDL
2. dockerとdocker-composeの実行環境を用意
3. [デバッグメニュー](about:debugging#/runtime/this-firefox)へ移動
4. gitのルートディレクトリで`docker-compose up -d`を実行しコンパイルを実行
5. `dest`読み込み編集

### 注意事項
同じファイルでChrome/Firefoxどちらも動作する必要があります。

## ライセンス
MIT

## 作者
AyumuNekozuki / [@nekozuki_dev](https://twitter.com/nekozuki_dev) / https://portfolio.nekozuki.me/

## SpecialThanks
[@hiyakake](https://github.com/hiyakake) 

### 不具合報告協力
[@momoirodouhu](https://twitter.com/momoirodouhu) / [@suo_nico](https://twitter.com/suo_nico)

---

[作業メモ](memo.md)
