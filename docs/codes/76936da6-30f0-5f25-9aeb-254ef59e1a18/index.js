// 1. id指定をしているものは実はglobalに格納されている
var canvas = myCanvas,
    ctx = canvas.getContext("2d");
if(!ctx) throw new Error("canvasが作れない");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var img = new Image();
img.src = "/jsdoitArchives/assets/img/photo-1483728642387-6c3bdd6c93e5.jpeg";

// キャッシュを強制的に使わせない -> onloadが必ず呼ばれる
//img.src = "/jsdoitArchives/assets/img/photo-1454789591675-556c287e39e2.jpeg" + "?" + new Date().getTime();

var draw = function(image) {
    // 2.naturalWidth, naturalHeightプロパティがある
    ctx.drawImage(image, 50, 50, image.naturalWidth, image.naturalHeight);
};

// 3. すでにimgの読み込みが完了していたら、completeがtrueになっている
if(img.complete) {
    console.log("load completed.");
    draw(img);
} else {
    img.onload = function() {
        console.log("onload.");
        draw(img);
    };
}

