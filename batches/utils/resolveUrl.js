const path = require("path");

const absolutePath = "https://takumifukasawa.github.io/jsdoitArchives";
const absoluteAssetsPath = `${absolutePath}/assets/`;
const basePath = "/jsdoitArchives/";
const assetsPath = path.join(basePath, "assets/");

exports.codeUrl = (codeName) => {
  return `${absolutePath}/codes/${codeName}/`;
};

exports.imgAssetsPath = (src) => {
  return path.join(assetsPath, "img", src);
};

exports.imgAssetsAbsolutePath = (src) => {
  return `${absoluteAssetsPath}img/${src}`;
};

exports.videoAssetsPath = (src) => {
  return path.join(assetsPath, "video", src);
};

exports.audioAssetsPath = (src) => {
  return path.join(assetsPath, "audio", src);
};
