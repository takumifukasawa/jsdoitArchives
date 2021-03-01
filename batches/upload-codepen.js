const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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
 */
async function main() {
  const dirs = IOUtils.getDirectories(srcRootPath);

  await IOUtils.removeDir(distRootPath);

  await IOUtils.createDir(distRootPath);

  dirs.forEach(async (dirName) => {
    const files = await IOUtils.getFilesInDirectory(
      path.join(srcRootPath, dirName)
    );

    const newDirName = uuidv4();

    const codeDistRootPath = path.join(distRootPath, newDirName);

    await IOUtils.createDir(codeDistRootPath);

    files.forEach(async (fileName) => {
      const srcFilePath = path.join(srcRootPath, dirName, fileName);
      const writePath = path.join(codeDistRootPath, fileName);

      const content = fs.readFileSync(srcFilePath, "utf8");

      let newContent = content;

      cdnReplacers.forEach((replacer) => {
        const matched = content.match(replacer.regex);
        if (!matched) return;
        const [oldCdn, version] = matched;
        const newCdn = replacer.buildCdn(version);
        newContent = content.replace(oldCdn, newCdn);
      });

      const ext = path.extname(fileName).split(".")[1];

      // compile sass
      if (ext === "scss") {
        newContent = await compileScss(srcFilePath, newContent);
      }

      // compile coffee script
      if (ext === "coffee") {
        newContent = await compileCoffee(newContent);
      }

      fs.writeFileSync(writePath, newContent, (err) => {
        if (err) throw err;
      });
    });
  });
}

main();
