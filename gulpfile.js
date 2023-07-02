const browserSync = require('browser-sync')

const { watch, series, dest, src, parallel } = require('gulp')

// Подключаем compress-images для работы с изображениями
const imagecomp = require('compress-images')

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'))

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer')

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css')

// Подключаем модуль gulp-clean
var clean = require('gulp-clean')

// Подключаем модуль gup
const pug = require('gulp-pug');

// Подключаем gulp-concat
const concat = require('gulp-concat');
 
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

function html()
{
  return src('src/index.pug')
  .pipe(
		pug({
			pretty: true
		})
	  )
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

function css()
{
  return src('src/assets/styles/**/*.scss') // берём все файлы со стилями
		.pipe(sass().on('error', sass.logError)) // конвертируем в css
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
    .pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
		.pipe(dest('build/assets/styles')) // складываем в папку билда
		.pipe(browserSync.stream()) // обновляем вкладку браузера
}

function fonts() 
{
  return src('src/assets/fonts/**/*')
    .pipe(dest('build/assets/fonts/'))
    .pipe(browserSync.stream())
}

async function images()
{
  imagecomp(
    'src/assets/images/**/*', // Берём все изображения из папки источника
    'build/assets/images/', // Выгружаем оптимизированные изображения в папку назначения
    { compress_force: false, statistic: true, autoupdate: true }, false, // Настраиваем основные параметры
    { jpg: { engine: 'mozjpeg', command: ['-quality', '75'] } }, // Сжимаем и оптимизируем изображеня
    { png: { engine: 'pngquant', command: ['--quality=75-100', '-o'] } },
    { svg: { engine: 'svgo', command: '--multipass' } },
    { gif: { engine: 'gifsicle', command: ['--colors', '64', '--use-col=web'] } },
    function (err, completed) { // Обновляем страницу по завершению
      if (completed === true) {
        browserSync.reload()
      }
    },
  )
}

function scripts() {
	return src('src/assets/js/*.js') // Берем файлы из источников
	.pipe(concat('app.min.js')) // Конкатенируем в один файл
	.pipe(uglify()) // Сжимаем JavaScript
	.pipe(dest('build/assets/js/')) // Выгружаем готовый файл в папку назначения
	.pipe(browserSync.stream()) // Триггерим Browsersync для обновления страницы
}

function browsersync()
{
  browserSync.init({
    server: {
      baseDir: 'build',
    },
  })
}

function startWatch()
{
  watch('src/**/*.pug', html)
  watch('src/assets/styles/**/*.scss', css)
  watch('src/assets/images/**/*', images)
  watch('src/assets/fonts/**/*', fonts)
  watch('src/assets/js/**/*', scripts)
}

function clear()
{
  return src('build', { read: false })
    .pipe(clean())
}

exports.dev   = parallel(browsersync, startWatch, html, css, images, fonts, scripts)
exports.build = series(clear, parallel(html, css, images, fonts, scripts))


exports.default = parallel(browsersync, startWatch, html, css, images, fonts, scripts)