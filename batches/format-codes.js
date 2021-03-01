const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const sass = require("sass");
const CoffeeScript = require("coffeescript");
const IOUtils = require("./utils/IOUtils");

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
    regex: /http:\/\/jsdo\.it\/lib\/three\.js-r([0-9]*)\/js/,
    buildCdn: (version) =>
      `https://cdnjs.cloudflare.com/ajax/libs/three.js/r${version}/three.min.js`,
  },
  {
    regex: /http:\/\/jsdo\.it\/lib\/createjs-([0-9|\.])*\/js/,
    buildCdn: () => "https://code.createjs.com/1.0.0/createjs.min.js",
  },
];

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

        cdnReplacers.forEach((replacer) => {
          const matched = content.match(replacer.regex);
          if (!matched) return;
          const [oldCdn, version] = matched;
          const newCdn = replacer.buildCdn(version);
          newContent = content.replace(oldCdn, newCdn);
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
