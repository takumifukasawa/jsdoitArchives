const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const { srcRootPath, distRootPath } = require("./constants");
const IOUtils = require("./utils/IOUtils");

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

  await Promise.all(
    dirs.map(async (dirName) => {
      const newDirName = uuidv5(
        dirName,
        "82b8e05c-4623-4c75-afc9-d986065f581c"
      );

      indexContents += `<p><a href="/player.html#${newDirName}" target="_blank">${dirName}</a></p>\n`;
    })
  );

  // index file を書き込み
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
