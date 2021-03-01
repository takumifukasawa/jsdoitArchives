const fs = require("fs");
const rimraf = require("rimraf");
const path = require("path");

/**
 * ディレクトリ削除
 *
 * @param {*} dirPath
 * @returns
 */
exports.removeDir = (dirPath) => {
  return new Promise((resolve) => {
    rimraf(dirPath, () => {
      resolve();
    });
  });
};

/**
 * ディレクトリの中のファイルを一括取得
 *
 * @param {*} dirPath
 * @returns
 */
exports.getFilesInDirectory = (dirPath) => {
  return new Promise((resolve) => {
    fs.readdir(dirPath, (err, files) => {
      resolve(files);
    });
  });
};

/**
 * ディレクトリ生成
 *
 * @param {*} dirPath
 * @returns
 */
exports.createDir = (dirPath) => {
  return new Promise((resolve) => {
    fs.mkdir(dirPath, (err) => {
      resolve();
    });
  });
};

/**
 * ディレクトリ一覧を取得
 *
 * @param {*} source
 */
exports.getDirectories = (source) =>
  fs
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

/**
 * base: https://gist.github.com/victorsollozzo/4134793
 * ファイルパスを再帰的に取得
 *
 * @param {*} base
 * @param {*} extensions
 * @param {*} files
 * @param {*} result
 * @returns
 */
function recursiveFindByExtensions(base, extensions, files, result) {
  const tmpFiles = files || fs.readdirSync(base);
  let tmpResult = result || [];

  tmpFiles.forEach(function (file) {
    const newBase = path.join(base, file);
    if (fs.statSync(newBase).isDirectory()) {
      tmpResult = recursiveFindByExtensions(
        newBase,
        extensions,
        fs.readdirSync(newBase),
        tmpResult
      );
      return;
    }

    for (let i = 0; i < extensions.length; i += 1) {
      const ext = extensions[i];
      if (file.substr(-1 * (ext.length + 1)) === `.${ext}`) {
        tmpResult.push(newBase);
        return;
      }
    }
  });
  return tmpResult;
}

exports.recursiveFindByExtensions = recursiveFindByExtensions;
