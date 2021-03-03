const path = require("path");

exports.codeUrl = (codeName) => {
  return `https://takumifukasawa.github.io/jsdoitArchives/codes/${codeName}/`;
};

exports.imgAssetsPath = (src) => {
  return path.join("/jsdoitArchives/assets/img/", src);
};
