const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
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

    files.forEach((fileName) => {
      const content = fs.readFileSync(
        path.join(srcRootPath, dirName, fileName),
        "utf8"
      );

      let newContent = content;

      cdnReplacers.forEach((replacer) => {
        const matched = content.match(replacer.regex);
        if (!matched) return;
        const [oldCdn, version] = matched;
        const newCdn = replacer.buildCdn(version);
        newContent = content.replace(oldCdn, newCdn);
      });

      const writePath = path.join(codeDistRootPath, fileName);
      fs.writeFileSync(writePath, newContent, (err) => {
        if (err) throw err;
      });

      // const b = a.replace(jqueryRegex);
      // console.log(a);
    });
  });
}

main();
