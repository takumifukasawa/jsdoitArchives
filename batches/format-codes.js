const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const sass = require("sass");
const CoffeeScript = require("coffeescript");
const _ = require("lodash");
const IOUtils = require("./utils/IOUtils");
const constants = require("./constants");

const codesDistRootPath = path.join(constants.distRootPath, "codes");

const distImgAssetsPath = path.join(constants.distRootPath, "assets/img");
const distAudioAssetsPath = path.join(constants.distRootPath, "assets/audio");

const jpgImages = IOUtils.recursiveFindByExtensions(distImgAssetsPath, [
  "jpg",
  "jpeg",
]);
const pngImages = IOUtils.recursiveFindByExtensions(distImgAssetsPath, ["png"]);
const gifImages = IOUtils.recursiveFindByExtensions(distImgAssetsPath, ["gif"]);
const audioAssets = IOUtils.recursiveFindByExtensions(distAudioAssetsPath, [
  "mp3",
]);

const pngElemSampler = randomSampler(pngImages);
const jpgElemSampler = randomSampler(jpgImages);
const audioAssetSampler = randomSampler(audioAssets);
const gifElemSampler = randomSampler(gifImages);

const threejsCdnRegexs = [
  /http:\/\/jsdo\.it\/lib\/three\.js-r([0-9]*?)\/js/,
  /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r?([0-9]{1,3})\/(three\.min|three)\.js/,
  /https:\/\/ajax\.googleapis\.com\/ajax\/libs\/threejs\/r([0-9]{1,3})\/three\.min\.js/,
];

const linkReplacers = [
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/jquery-([0-9|\.]*?)\/js/],
    buildCdn: (version) => `https://code.jquery.com/jquery-${version}.min.js`,
  },
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/jquery\.easing\.([0-9|\.]*?)\/js/],
    buildCdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/${version}/jquery.easing.min.js`,
  },
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/createjs-([0-9|\.])*?\/js/],
    buildCdn: () => "https://code.createjs.com/1.0.0/createjs.min.js",
  },
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/underscore-([0-9|\.]*?)\/js/],
    buildCdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/underscore.js/${version}/underscore-min.js`,
  },
  {
    regexs: [/http:\/\/jsrun\.it\/assets\/6\/X\/t\/N\/6XtNc/],
    buildCdn: () =>
      "https://cdn.jsdelivr.net/npm/stats-js@1.0.1/build/stats.min.js",
  },
  {
    regexs: [
      /http:\/\/jsrun\.it\/assets\/M\/7\/M\/h\/M7Mhi/,
      /http:\/\/jsrun\.it\/assets\/E\/D\/W\/u\/EDWut/,
    ],
    buildCdn: () =>
      getThreejsNewCdn(88, "examples/js/controls/OrbitControls.js"),
  },
];

const threeModulesReplacers = [
  {
    regexs: threejsCdnRegexs,
    buildCdn: (version) => {
      if (version < 78) {
        return getThreejsNewCdn(version, "three.min.js");
      }
      return getThreejsNewCdn(version, "build/three.min.js");
    },
  },
  {
    regexs: [
      /http:\/\/mrdoob\.github\.io\/three\.js\/examples\/js\/renderers\/CanvasRenderer\.js/,
    ],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/renderers/CanvasRenderer.js"),
  },
  {
    regexs: [
      /http:\/\/mrdoob\.github\.io\/three\.js\/examples\/js\/renderers\/Projector\.js/,
    ],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/renderers/Projector.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/libs\/tween\.min\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/libs/tween.min.js"),
  },
  {
    regexs: [
      /http:\/\/threejs\.org\/examples\/js\/controls\/OrbitControls\.js/,
      /http:\/\/n0bisuke\.github\.io\/practice_threejs\/OrbitControls\.js/,
      /http:\/\/jsrun\.it\/assets\/W\/k\/Z\/U\/WkZUc/,
    ],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/controls/OrbitControls.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/Detector\.js/],
    buildCdn: (version) => getThreejsNewCdn(version, "examples/js/Detector.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/libs\/stats\.min\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/libs/stats.min.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/utils\/FontUtils\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/utils/FontUtils.js"),
  },
  {
    regexs: [
      /http:\/\/threejs\.org\/examples\/js\/geometries\/TextGeometry\.js/,
    ],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/geometries/TextGeometry.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/libs\/stats\.min\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/libs/stats.min.js"),
  },
  {
    regexs: [
      /http:\/\/threejs\.org\/examples\/fonts\/gentilis_regular\.typeface\.js/,
    ],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/fonts/gentilis_regular.typeface.js"),
  },
  {
    regexs: [/http:\/\/threejs.org\/examples\/obj\/walt\/WaltHead\.obj/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/obj/walt/WaltHead.obj"),
  },
  {
    regexs: [/http:\/\/threejs.org\/examples\/obj\/walt\/WaltHead\.mtl/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/obj/walt/WaltHead.mtl"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/loaders\/OBJLoader\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/loaders/OBJLoader.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/loaders\/MTLLoader\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/loaders/MTLLoader.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/loaders\/GLTFLoader\.js/],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/loaders/GLTFLoader.js"),
  },
  {
    regexs: [
      /http:\/\/threejs.org\/examples\/js\/geometries\/TextGeometry\.js/,
    ],
    buildCdn: (version) =>
      getThreejsNewCdn(version, "examples/js/geometries/TextGeometry.js"),
  },
];

/**
 *
 *
 * @param {*} content
 * @param {*} regexs
 * @returns
 */
function matchedRegexs(content, regexs) {
  // console.log(regexs.length);
  for (let i = 0; i < regexs.length; i++) {
    const regex = regexs[i];
    const matched = content.match(regex);
    if (matched) {
      return matched;
    }
  }
  return false;
}

/**
 *
 *
 * @param {*} content
 * @returns
 */
function getThreejsVersion(content) {
  const matched = matchedRegexs(content, threejsCdnRegexs);
  if (matched) {
    // console.log(matched[0], matched[1]);
    const [, version] = matched;
    let v = parseInt(version, 10);
    v = Math.max(v, 74);
    // v = Math.max(v, 74);
    return v;
  }

  return null;
}

/**
 *
 *
 * @param {*} version
 * @param {*} path
 * @returns
 */
function getThreejsNewCdn(version, path) {
  return `https://unpkg.com/three@0.${version}.0/${path}`;
}

/**
 *
 *
 * @param {*} file
 * @param {*} content
 * @returns
 */
async function compileScss(file, content) {
  return new Promise((resolve, reject) => {
    sass.render({ file }, (err, result) => {
      if (err) {
        reject(content);
        return;
      }
      resolve(result);
    });
  });
}

/**
 *
 *
 * @param {*} file
 * @param {*} content
 * @returns
 */
async function compileCoffee(content) {
  return new Promise((resolve, reject) => {
    const res = CoffeeScript.compile(newContent, {
      transpile: { presets: ["@babel/env"] },
    });
    if (!res) {
      reject(content);
      return;
    }
    resolve(res);
  });
}

/**
 *
 *
 * @param {*} pool
 * @returns
 */
function randomSampler(pool) {
  let tmpPool = [];
  const pick = () => {
    if (tmpPool.length < 1) {
      tmpPool = _.cloneDeep(pool);
    }
    const elem = _.sample(tmpPool);
    const index = tmpPool.indexOf(elem);
    tmpPool.slice(index, 1);
    return elem;
  };
  return {
    pick,
  };
}

/**
 *
 *
 * @param {*} content
 * @returns
 */
function replaceImage(content) {
  let tmpContent = content;

  const regex = /(http:\/\/jsrun\.it)?\/assets\/.*?\.(png|jpg|gif)/g;
  const matched = [...tmpContent.matchAll(regex)];

  if (matched.length < 1) {
    return tmpContent;
  }

  for (let i = 0; i < matched.length; i++) {
    const [url, , ext] = matched[i];
    let img = "";
    switch (ext) {
      case "png":
        img = pngElemSampler.pick();
        break;
      case "jpg":
        img = jpgElemSampler.pick();
        break;
      case "gif":
        img = gifElemSampler.pick();
        break;
    }
    const basename = path.basename(img);
    tmpContent = tmpContent.replace(
      url,
      path.join("/jsdoitArchives/assets/img", basename)
    );
  }

  return tmpContent;
}

/**
 *
 *
 * @param {*} content
 * @returns
 */
function replaceAudio(content) {
  let tmpContent = content;

  const regex = /https?:\/\/.*?.mp3/g;
  const matched = [...tmpContent.matchAll(regex)];

  if (matched.length < 1) {
    return tmpContent;
  }

  for (let i = 0; i < matched.length; i++) {
    const [url] = matched[i];

    const asset = audioAssetSampler.pick();

    const basename = path.basename(asset);
    tmpContent = tmpContent.replace(
      url,
      path.join("/jsdoitArchives/assets/audio", basename)
    );
  }

  return tmpContent;
}

/**
 *
 *
 */
async function main() {
  const dirs = IOUtils.getDirectories(constants.archivesSrcRootPath);

  await IOUtils.removeDir(codesDistRootPath);

  await IOUtils.createDir(codesDistRootPath);

  // dirs.sort();

  await Promise.all(
    dirs.map(async (dirName) => {
      const files = await IOUtils.getFilesInDirectory(
        path.join(constants.archivesSrcRootPath, dirName)
      );

      const newDirName = uuidv5(
        dirName,
        "82b8e05c-4623-4c75-afc9-d986065f581c"
      );

      const codeDistRootPath = path.join(codesDistRootPath, newDirName);

      await IOUtils.removeDir(codeDistRootPath);

      await IOUtils.createDir(codeDistRootPath);

      files.forEach(async (file) => {
        const srcFilePath = path.join(
          constants.archivesSrcRootPath,
          dirName,
          file
        );

        const content = fs.readFileSync(srcFilePath, "utf8");

        let newFile = file;
        let newContent = content;

        // threejsのバージョンがわかる場合は関連モジュールをreplace
        {
          const threejsVersion = getThreejsVersion(content);

          if (threejsVersion) {
            for (let i = 0; i < threeModulesReplacers.length; i++) {
              const replacer = threeModulesReplacers[i];
              const matched = matchedRegexs(newContent, replacer.regexs);
              if (matched) {
                // console.log(matched[0]);
                const [regexCdn] = matched;
                const newCdn = replacer.buildCdn(threejsVersion);
                newContent = newContent.replace(regexCdn, newCdn);
              }
            }
          }
        }

        // 各種linkをreplace
        {
          for (let i = 0; i < linkReplacers.length; i++) {
            const replacer = linkReplacers[i];
            const matched = matchedRegexs(newContent, replacer.regexs);
            if (matched) {
              // console.log(matched[0]);
              const [regexCdn, version] = matched;
              const newCdn = replacer.buildCdn(version);
              newContent = newContent.replace(regexCdn, newCdn);
            }
          }
        }

        // replace image assets
        newContent = replaceImage(newContent);

        // replace audio assets
        newContent = replaceAudio(newContent);

        // ファイルの拡張子に応じてcompile
        {
          const [fileName, fileExt] = path.extname(file).split(".")[1];

          // compile sass
          if (fileExt === "scss") {
            newContent = await compileScss(srcFilePath, newContent);
            newFile = [fileName, "css"].join(".");
          }

          // compile coffee script
          if (fileExt === "coffee") {
            newContent = await compileCoffee(newContent);
            newFile = [fileName, "js"].join(".");
          }
        }

        // 書き込み

        const writeCodesFilePath = path.join(codeDistRootPath, newFile);

        fs.writeFile(writeCodesFilePath, newContent, "utf8", (err) => {
          if (err) throw err;
        });
      });
    })
  );
}

main();
