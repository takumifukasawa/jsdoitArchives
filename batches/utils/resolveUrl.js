const path = require("path");

const absoluteUrl = "https://takumifukasawa.github.io/jsdoitArchives";

exports.codeUrl = (codeName) => {
  return `${absoluteUrl}/codes/${codeName}/`;
};

exports.imgAssetsPath = (src) => {
  return path.join("/jsdoitArchives/assets/img/", src);
};

exports.imgAssetsAbsolutePath = (src) => {
  return `${absoluteUrl}/assets/img/${src}`;
};

exports.videoAssetsPath = (src) => {
  return path.join("/jsdoitArchives/assets/video/", src);
};
