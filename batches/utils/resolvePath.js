const path = require("path");

const absolutePath = "https://takumifukasawa.github.io/jsdoitArchives/";
const absoluteAssetsPath = `${absolutePath}assets/`;
const basePath = "/jsdoitArchives/";
const assetsPath = path.join(basePath, "assets/");

const codeAbsolutePath = (codeName) => {
  return `${absolutePath}codes/${codeName}/`;
};

exports.codeAbsolutePath = codeAbsolutePath;

exports.fromCodeAbsolutePath = (codeName, src) => {
  return `${codeAbsolutePath(codeName)}${src}`;
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
