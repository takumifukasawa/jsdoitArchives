const { parse } = require("node-html-parser");
const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const sass = require("sass");
const CoffeeScript = require("coffeescript");
const _ = require("lodash");
const IOUtils = require("./utils/IOUtils");
const resolvePath = require("./utils/resolvePath");
const constants = require("./constants");
const hashCode = require("./utils/hashCode");

const codesDistRootPath = path.join(constants.distRootPath, "codes");

const distImgAssetsPath = path.join(constants.distRootPath, "assets/img");
const distAudioAssetsPath = path.join(constants.distRootPath, "assets/audio");
// const distVideoAssetsPath = path.join(constants.distRootPath, "assets/video");

const jpgImages = IOUtils.recursiveFindByExtensions(distImgAssetsPath, [
  "jpg",
  "jpeg",
]);
const pngImages = IOUtils.recursiveFindByExtensions(distImgAssetsPath, ["png"]);
const gifImages = IOUtils.recursiveFindByExtensions(distImgAssetsPath, ["gif"]);
const audioAssets = IOUtils.recursiveFindByExtensions(distAudioAssetsPath, [
  "mp3",
]);
// const videoAssets = IOUtils.recursiveFindByExtensions(distVideoAssetsPath, [
//   "mp4",
// ]);

const ringSampler = (arr, str) => {
  const hash = hashCode(str);
  let index = Math.abs(hash) % arr.length;
  const pick = () => {
    const elem = arr[index];
    index++;
    if (index >= arr.length) {
      index = 0;
    }
    return elem;
  };
  return {
    pick,
  };
};

// const pngElemSampler = randomSampler(pngImages);
// const jpgElemSampler = randomSampler(jpgImages);
// const gifElemSampler = randomSampler(gifImages);
// const audioAssetSampler = randomSampler(audioAssets);
// const videoAssetSampler = randomSampler(videoAssets);

// const audioAssetSampler = ringSampler(audioAssets);

const threejsCdnRegexs = [
  /http:\/\/jsdo\.it\/lib\/three\.js-r([0-9]*?)\/js/,
  /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r?([0-9]{1,3})\/(three\.min|three)\.js/,
  /https:\/\/ajax\.googleapis\.com\/ajax\/libs\/threejs\/r([0-9]{1,3})\/three\.min\.js/,
];

const linkReplacers = [
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/jquery-([0-9|\.]*?)\/js/],
    buildLink: (version) => `https://code.jquery.com/jquery-${version}.min.js`,
  },
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/jquery\.easing\.([0-9|\.]*?)\/js/],
    buildLink: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/${version}/jquery.easing.min.js`,
  },
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/createjs-([0-9|\.])*?\/js/],
    buildLink: () => "https://code.createjs.com/1.0.0/createjs.min.js",
  },
  {
    regexs: [/http:\/\/jsdo\.it\/lib\/underscore-([0-9|\.]*?)\/js/],
    buildLink: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/underscore.js/${version}/underscore-min.js`,
  },
  {
    regexs: [/http:\/\/jsrun\.it\/assets\/6\/X\/t\/N\/6XtNc/],
    buildLink: () =>
      "https://cdn.jsdelivr.net/npm/stats-js@1.0.1/build/stats.min.js",
  },
  {
    regexs: [
      /http:\/\/jsrun\.it\/assets\/M\/7\/M\/h\/M7Mhi/,
      /http:\/\/jsrun\.it\/assets\/E\/D\/W\/u\/EDWut/,
    ],
    buildLink: () =>
      getThreejsNewCdn(88, "examples/js/controls/OrbitControls.js"),
  },
  {
    regexs: [/http:\/\/jsrun\.it\/assets\/q\/s\/K\/0\/qsK08/],
    buildLink: () => resolvePath.videoAssetsPath("sample-1.mp4"),
  },
];

const threeModulesReplacers = [
  {
    regexs: threejsCdnRegexs,
    buildLink: (version) => {
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
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/renderers/CanvasRenderer.js"),
  },
  {
    regexs: [
      /http:\/\/mrdoob\.github\.io\/three\.js\/examples\/js\/renderers\/Projector\.js/,
    ],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/renderers/Projector.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/libs\/tween\.min\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/libs/tween.min.js"),
  },
  {
    regexs: [
      /http:\/\/threejs\.org\/examples\/js\/controls\/OrbitControls\.js/,
      /http:\/\/n0bisuke\.github\.io\/practice_threejs\/OrbitControls\.js/,
      /http:\/\/jsrun\.it\/assets\/W\/k\/Z\/U\/WkZUc/,
    ],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/controls/OrbitControls.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/Detector\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/Detector.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/libs\/stats\.min\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/libs/stats.min.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/utils\/FontUtils\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/utils/FontUtils.js"),
  },
  {
    regexs: [
      /http:\/\/threejs\.org\/examples\/js\/geometries\/TextGeometry\.js/,
    ],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/geometries/TextGeometry.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/libs\/stats\.min\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/libs/stats.min.js"),
  },
  {
    regexs: [
      /http:\/\/threejs\.org\/examples\/fonts\/gentilis_regular\.typeface\.js/,
    ],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/fonts/gentilis_regular.typeface.js"),
  },
  {
    regexs: [/http:\/\/threejs.org\/examples\/obj\/walt\/WaltHead\.obj/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/obj/walt/WaltHead.obj"),
  },
  {
    regexs: [/http:\/\/threejs.org\/examples\/obj\/walt\/WaltHead\.mtl/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/obj/walt/WaltHead.mtl"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/loaders\/OBJLoader\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/loaders/OBJLoader.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/loaders\/MTLLoader\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/loaders/MTLLoader.js"),
  },
  {
    regexs: [/http:\/\/threejs\.org\/examples\/js\/loaders\/GLTFLoader\.js/],
    buildLink: (version) =>
      getThreejsNewCdn(version, "examples/js/loaders/GLTFLoader.js"),
  },
  {
    regexs: [
      /http:\/\/threejs.org\/examples\/js\/geometries\/TextGeometry\.js/,
    ],
    buildLink: (version) =>
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

async function formatHtml(content, dirName, url) {
  return new Promise((resolve) => {
    const root = parse(content);
    const head = root.querySelector("head");
    const title = root.querySelector("title").textContent;

    let headText = head.toString();

    const ogpPath = path.join(
      constants.srcRootPath,
      "thumbnails",
      dirName,
      "ogp.png"
    );

    fs.access(ogpPath, fs.F_OK, (err) => {
      const ogImage = err
        ? resolvePath.imgAssetsAbsolutePath("default-ogp.png")
        : resolvePath.fromCodeAbsolutePath(dirName, "ogp.png");
      headText += `
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="&nbsp;" />
<meta property="og:image" content="${ogImage}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="&nbsp;" />
<meta name="twitter:image" content="${ogImage}" />
`;
      head.set_content(headText);
      // head.set_content('<og id="test"></div>');

      // `
      // <meta property="og:url" content="http://bits.blogs.nytimes.com/2011/12/08/a-twitter-for-my-sister/" />
      // <meta property="og:title" content="A Twitter for My Sister" />
      // <meta property="og:description" content="${}" />
      // <meta property="og:image" content="${}" />
      // `

      resolve(root.toString());
    });
  });
}

// /**
//  *
//  *
//  * @param {*} file
//  * @param {*} content
//  * @returns
//  */
// async function compileScss(file, content) {
//   return new Promise((resolve, reject) => {
//     sass.render({ file }, (err, result) => {
//       if (err) {
//         reject(content);
//         return;
//       }
//       resolve(result);
//     });
//   });
// }
//
// /**
//  *
//  *
//  * @param {*} file
//  * @param {*} content
//  * @returns
//  */
// async function compileCoffee(content) {
//   return new Promise((resolve, reject) => {
//     const res = CoffeeScript.compile(newContent, {
//       transpile: { presets: ["@babel/env"] },
//     });
//     if (!res) {
//       reject(content);
//       return;
//     }
//     resolve(res);
//   });
// }

// /**
//  *
//  *
//  * @param {*} pool
//  * @returns
//  */
// function randomSampler(pool) {
//   let tmpPool = [];
//   const pick = () => {
//     if (tmpPool.length < 1) {
//       tmpPool = _.cloneDeep(pool);
//     }
//     const elem = _.sample(tmpPool);
//     const index = tmpPool.indexOf(elem);
//     tmpPool.slice(index, 1);
//     return elem;
//   };
//   return {
//     pick,
//   };
// }

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

  const pngElemSampler = ringSampler(pngImages, content);
  const jpgElemSampler = ringSampler(jpgImages, content);
  const gifElemSampler = ringSampler(gifImages, content);

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
    tmpContent = tmpContent.replace(url, resolvePath.imgAssetsPath(basename));
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

  const audioAssetSampler = ringSampler(audioAssets, content);

  for (let i = 0; i < matched.length; i++) {
    const [url] = matched[i];

    const asset = audioAssetSampler.pick();

    const basename = path.basename(asset);
    tmpContent = tmpContent.replace(url, resolvePath.audioAssetsPath(basename));
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
                const newCdn = replacer.buildLink(threejsVersion);
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
              const newCdn = replacer.buildLink(version);
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
          // const [fileName, fileExt] = path.extname(file).split(".")[1];
          const [, fileExt] = path.basename(file).split(".");

          // html format html
          if (fileExt === "html") {
            newContent = await formatHtml(
              newContent,
              newDirName,
              resolvePath.codeAbsolutePath(newDirName)
            );
          }

          // // compile sass
          // if (fileExt === "scss") {
          //   newContent = await compileScss(srcFilePath, newContent);
          //   newFile = [fileName, "css"].join(".");
          // }

          // // compile coffee script
          // if (fileExt === "coffee") {
          //   newContent = await compileCoffee(newContent);
          //   newFile = [fileName, "js"].join(".");
          // }
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
