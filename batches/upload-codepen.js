const fs = require("fs");
const path = require("path");
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
const replacedRootPath = path.join(process.cwd(), "src/replaced");

const dirs = IOUtils.getDirectories(srcRootPath);

dirs.forEach(async (dirName) => {
  const files = await IOUtils.getFilesInDirectory(
    path.join(srcRootPath, dirName)
  );

  await IOUtils.createDir(path.join(replacedRootPath, dirName));

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

    const writePath = path.join(
      process.cwd(),
      "src/replaced",
      dirName,
      fileName
    );
    fs.writeFileSync(writePath, newContent, (err) => {
      if (err) throw err;
    });

    // const b = a.replace(jqueryRegex);
    // console.log(a);
  });
});
