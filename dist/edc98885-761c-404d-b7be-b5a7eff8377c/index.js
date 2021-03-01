// 現在地
"use strict";

var from = encodeURIComponent("桜木町");

// 行き先
var to = encodeURIComponent("関内駅");

var ua = window.navigator.userAgent;
var isAndroid = /Android/.test(ua);

var href = "";

var link = document.getElementById("link");

if (isAndroid) {
  href = "https://www.google.co.jp/maps/dir/" + from + "/" + to;
  link.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm('google map へ移動します。')) {
      location.href = this.getAttribute("href");
    }
  });
} else {
  href = "comgooglemaps://?saddr=" + from + "&daddr=" + to;
}

link.setAttribute("href", href);

