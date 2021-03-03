const { parse } = require("node-html-parser");
const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const { srcRootPath, distRootPath } = require("./constants");
const IOUtils = require("./utils/IOUtils");
const asyncUtils = require("./utils/asyncUtils");
const constants = require("./constants");

const distIndexFilePath = path.join(distRootPath, "index.html");

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
  <div id="content"></div>
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

  let indexContents = "";

  dirs.sort();

  asyncUtils.execPromiseInSequence(
    dirs.map((dirName) => async () => {
      return new Promise((resolve) => {
        const newDirName = uuidv5(
          dirName,
          "82b8e05c-4623-4c75-afc9-d986065f581c"
        );
        const thumbnailPath = path.join(
          constants.distRootPath,
          "codes",
          newDirName,
          "thumbnail.png"
        );

        fs.access(thumbnailPath, fs.F_OK, (err) => {
          const thumbnailSrc = err
            ? "/common/img/thumbnail.png"
            : path.join("/common/img/", dirName, "thumbnail.png");
          indexContents += `<p><a href="player.html?code=${newDirName}" target="_blank">${dirName}</a><img src="${thumbnailSrc}" alt="" /></p>\n`;
          resolve();
        });
      });
    })
  );

  const root = parse(buildIndexHTML(""));
  root.set_content(indexContents);

  // index file を書き込み
  fs.writeFile(
    distIndexFilePath,
    root.toString(),
    // buildIndexHTML(indexContents),
    "utf8",
    (err, data) => {
      if (err) throw err;
    }
  );
}

main();
