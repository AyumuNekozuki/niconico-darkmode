//出力先の定義
const DEST = './dest/';
//開発モードでコードを書き出すか
const CODE_STYLE_IS_DEV = true;



/**依存関係を読み込み
 * 処理のフロー順に記載するようにする
 * ***/

//gulpコア処理関連
const gulp = require('gulp'); //gulp本体
const plumber = require('gulp-plumber'); //エラー時に処理が止まらないように
const notify = require('gulp-notify'); //もしエラーが起きたら、プッシュ通知で知らせる
const mergeStream = require('merge-stream'); //複数の処理を行えるようにする
const changed = require('gulp-changed'); //前回と比べて変更があるものだけ処理するようにする
const gulpif = require('gulp-if'); //Gulp内でif文を使う

//ユーティリティ関連
const concat = require('gulp-concat'); //複数のファイルを一つのファイルにまとめる
const rename = require('gulp-rename'); //ファイル名を変更する
const sourcemaps = require('gulp-sourcemaps'); //ソースマップを生成する


//SCSS関連
const sass = require('gulp-sass'); //SCSSをCSSに変換

const postcss = require('gulp-postcss'); //PostCSSのコア CSSに後処理を加えていく 以下PostCSSのもの
const autoprefixer = require('autoprefixer'); //ベンダープレフィックスをつける
const cssDeclarationSorter = require('css-declaration-sorter'); //CSSの記載順を整える
const mqpacker = require('css-mqpacker'); //CSSのメディアクエリをまとめられる場合まとめる
const cssnano = require('cssnano'); //CSSのmin化

//画像関連
const imagemin = require('gulp-imagemin'); //画像を最適化する
const imageminMozjpeg = require('imagemin-mozjpeg'); //JPEG圧縮アルゴリズム
const imageminPngquant = require('imagemin-pngquant'); //PNG圧縮アルゴリズム
const imageminGifsicle = require('imagemin-gifsicle'); //GIF圧縮アルゴリズム
const imageminSvgo = require('imagemin-svgo'); //SVG圧縮アルゴリズム

//PHP・HTML関連
const htmlmin = require('gulp-htmlmin'); //HTMLからコメントを削除する

//JS関連
const babel = require('gulp-babel'); //jsのトランスパイル
const uglify = require('gulp-uglify'); //jsのmin化


/**処理内容 */

//SCSSの処理
function styles() {
	const INPATH = './src/style_for/';
	const OUTPATH = DEST + 'style_for';
	return gulp
		.src([INPATH + '**/*.scss'])
		.pipe(changed(OUTPATH)) //前回と比較して変更があるものだけに絞る
		.pipe(gulpif(CODE_STYLE_IS_DEV, sourcemaps.init())) //ソースマップエントリーポイント
		.pipe(
			plumber({
				errorHandler: notify.onError('Error: <%= error.message %>'),
			})
		) //エラーの出力
		.pipe(sass()) //ScssをCSSに変換
		.pipe(
			postcss([
				//ベンダープレフィックス
				autoprefixer({
					grid: 'autoplace',
				}),
				//CSSの順番を綺麗に
				cssDeclarationSorter({
					order: 'smacss',
				}),
				//メディアクエリをまとめる
				mqpacker(),
				//CSSの圧縮
				cssnano({ autoprefixer: false }),
			])
		)
		.pipe(gulpif(CODE_STYLE_IS_DEV, sourcemaps.write())) //ソースマップを書き込む
		.pipe(gulp.dest(OUTPATH));
}

//PHP・HTMLの処理
function php() {
	const INPATH = './src/';
	const OUTPATH = DEST + '';
	return gulp
		.src([INPATH + '**/*.php', INPATH + '**/*.html'])
		.pipe(changed(OUTPATH)) //変更があるものだけ処理
		.pipe(
			htmlmin({
				//HTMLを圧縮
				caseSensitive: true, //大文字小文字を区別
				collapseBooleanAttributes: true, //ブール属性値からtrueを省略
				decodeEntities: false, //特殊文字をエスケープ
				html5: true, //html5仕様で解析する
				minifyCSS: true, //インラインCSSを圧縮
				minifyJS: true, //インラインJSを圧縮
				removeComments: true, //コメントを削除
				removeEmptyAttributes: true, //空の属性値を削除
				removeRedundantAttributes: true, //指定されている属性値がデフォルト値であれば省略
				removeScriptTypeAttributes: true, //scriptタグのtypeを省略
				removeStyleLinkTypeAttributes: true, //styleタグのtypeを省略
				sortAttributes: true, //属性を並び替えて、gzipの圧縮率を高める,
				collapseWhitespace: true, //空白を削除
			})
		)
		.pipe(gulp.dest(OUTPATH));
}

//画像
function images() {
	const INPATH = './src/images/';
	const OUTPATH = DEST + 'images';
	return mergeStream(
		//PNG/GIF/JPGを圧縮
		gulp
			.src([
				INPATH + '**/*.png',
				INPATH + '**/*.gif',
				INPATH + '**/*.jpg',
			])
			.pipe(changed(OUTPATH)) //変更があるものだけ処理
			.pipe(
				imagemin(
					[
						//圧縮する
						imageminGifsicle(),
						imageminMozjpeg({ quality: 80, progressive: true }),
						imageminPngquant({ quality: [0.65, 0.8] }),
					],
					{
						verbose: true, //圧縮結果を出力する
					}
				)
			)
			.pipe(gulp.dest(OUTPATH)),

		//icoをそのまま流す
		gulp
			.src([INPATH + '**/*.ico'])
			.pipe(changed(OUTPATH)) //変更があるものだけ処理
			.pipe(gulp.dest(OUTPATH)),

		//SVGを圧縮して返す
		gulp
			.src([INPATH + '**/*.svg'])
			.pipe(changed(OUTPATH)) //変更があるものだけ処理
			.pipe(
				imagemin(
					[
						//圧縮する
						imageminSvgo(),
					],
					{
						verbose: true, //圧縮結果を出力する
					}
				)
			)
			.pipe(gulp.dest(OUTPATH)),

		//WebPをそのまま流す
		gulp
			.src([INPATH + '**/*.webp'])
			.pipe(changed(OUTPATH)) //変更があるものだけ処理
			.pipe(gulp.dest(OUTPATH))
	);
}

//JSの変換
function js() {
	const INPATH = './src/js/';
	const OUTPATH = DEST + 'js';
	return gulp
		.src([INPATH + '**/*.js'])
		.pipe(changed(OUTPATH)) //変更があるものだけ処理
		.pipe(gulpif(CODE_STYLE_IS_DEV, sourcemaps.init()))
		.pipe(
			babel({
				presets: ['@babel/preset-env'],
			})
		)
		.pipe(uglify())
		.pipe(gulpif(CODE_STYLE_IS_DEV, sourcemaps.write()))
		.pipe(gulp.dest(OUTPATH));
}

//JSONの処理
function json() {
	const INPATH = './src/';
	const OUTPATH = DEST + '';
	return gulp
		.src([INPATH + '**/*.json'])
		.pipe(changed(OUTPATH)) //変更があるものだけ処理
		.pipe(gulp.dest(OUTPATH));
}

/**変更の追跡 */
function watch() {
	gulp.watch(['src/style_for/**/*.scss'], styles);
	gulp.watch(['src/**/*.php', 'src/**/*.html'], php);
	gulp.watch(['src/images/**/*'], images);
	gulp.watch(['src/js/**/*.js'], js);
	gulp.watch(['src/**/*.json'], json);
}
/**初期動作 */
exports.default = gulp.series(styles, php, images, js,json, watch);
