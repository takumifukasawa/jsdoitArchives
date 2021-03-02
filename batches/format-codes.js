const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const sass = require("sass");
const CoffeeScript = require("coffeescript");
const IOUtils = require("./utils/IOUtils");

const threejsCdns = [
  /http:\/\/jsdo\.it\/lib\/three\.js-r([0-9]*)\/js/,
  /https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r?([0-9]{1,3})\/(three\.min|three)\.js/,
  /https:\/\/ajax\.googleapis\.com\/ajax\/libs\/threejs\/r([0-9]{1,3})\/three\.min\.js/,
  // /https:\/\/unpkg\.com\/three@0\.([0-9]{1,3})\.0\/build\/three\.min\.js/,
];

const cdnReplacers = [
  {
    regex: /http:\/\/jsdo\.it\/lib\/jquery-([0-9|\.]*)\/js/,
    buildCdn: (version) => `https://code.jquery.com/jquery-${version}.min.js`,
  },
  {
    regex: /http:\/\/jsdo\.it\/lib\/jquery\.easing\.([0-9|\.]*)\/js/,
    buildCdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/${version}/jquery.easing.min.js`,
  },
  {
    regex: /http:\/\/jsdo\.it\/lib\/createjs-([0-9|\.])*\/js/,
    buildCdn: () => "https://code.createjs.com/1.0.0/createjs.min.js",
  },
  {
    regex: /http:\/\/jsdo\.it\/lib\/underscore-([0-9|\.]*)\/js/,
    buildCdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/underscore.js/${version}/underscore-min.js`,
  },
];

const threeModules = [
  {
    regexs: threejsCdns,
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
  const matched = matchedRegexs(content, threejsCdns);
  if (matched) {
    console.log(matched[0], matched[1]);
    const [, version] = matched;
    let v = parseInt(version, 10);
    v = Math.max(v, 74);
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

const srcRootPath = path.join(process.cwd(), "src/archives");
const distRootPath = path.join(process.cwd(), "dist");

const codesDistRootPath = path.join(distRootPath, "codes");

const distIndexFilePath = path.join(distRootPath, "index.html");

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
 * @param {*} content
 * @returns
 */
function buildIndexHTML(content) {
  return `<html>
  <head>
    <title>Index</title>
    <style>
      p {
        font-size: 12px;
      }
    </style>
  </head>
<body>
  <h1>Index</h1>
  ${content}
</body>
</html>`;
}

/**
 *
 *
 */
async function main() {
  const dirs = IOUtils.getDirectories(srcRootPath);

  await IOUtils.removeDir(codesDistRootPath);

  await IOUtils.createDir(codesDistRootPath);

  let indexContents = "";

  dirs.sort();

  await Promise.all(
    dirs.map(async (dirName) => {
      const files = await IOUtils.getFilesInDirectory(
        path.join(srcRootPath, dirName)
      );

      const newDirName = uuidv5(
        dirName,
        "82b8e05c-4623-4c75-afc9-d986065f581c"
      );

      indexContents += `<p><a href="/player.html#${newDirName}" target="_blank">${dirName}</a></p>\n`;

      const codeDistRootPath = path.join(codesDistRootPath, newDirName);

      await IOUtils.removeDir(codeDistRootPath);

      await IOUtils.createDir(codeDistRootPath);

      files.forEach(async (file) => {
        const srcFilePath = path.join(srcRootPath, dirName, file);

        const content = fs.readFileSync(srcFilePath, "utf8");

        let newFile = file;
        let newContent = content;

        const threejsVersion = getThreejsVersion(content);

        if (threejsVersion) {
          for (let i = 0; i < threeModules.length; i++) {
            const replacer = threeModules[i];
            const matched = matchedRegexs(newContent, replacer.regexs);
            if (matched) {
              // console.log(matched[0]);
              const [regexCdn] = matched;
              const newCdn = replacer.buildCdn(threejsVersion);
              newContent = newContent.replace(regexCdn, newCdn);
            }
          }
        }

        cdnReplacers.forEach((replacer) => {
          const matched = newContent.match(replacer.regex);
          if (!matched) return;
          const [regexCdn, version] = matched;
          const newCdn = replacer.buildCdn(version);
          newContent = newContent.replace(regexCdn, newCdn);
        });

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

        const writeCodesFilePath = path.join(codeDistRootPath, newFile);

        fs.writeFile(writeCodesFilePath, newContent, "utf8", (err) => {
          if (err) throw err;
        });
      });
    })
  );

  fs.writeFile(
    distIndexFilePath,
    buildIndexHTML(indexContents),
    "utf8",
    (err, data) => {
      if (err) throw err;
    }
  );
}

main();
