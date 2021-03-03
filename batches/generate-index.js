const { parse } = require("node-html-parser");
const fs = require("fs");
const path = require("path");
const { v5: uuidv5 } = require("uuid");
const IOUtils = require("./utils/IOUtils");
const asyncUtils = require("./utils/asyncUtils");
const constants = require("./constants");

const distIndexFilePath = path.join(constants.distRootPath, "index.html");

/**
 *
 *
 */
async function main() {
  const dirs = IOUtils.getDirectories(constants.archivesSrcRootPath);

  let contentListString = "";

  dirs.sort();

  const srcIndexFilePath = path.join(constants.srcRootPath, "index.html");
  const srcIndexFileContent = fs.readFileSync(srcIndexFilePath, "utf8");

  await asyncUtils.execPromiseInSequence(
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
            ? "./common/img/default-thumbnail.png"
            : path.join("./codes", newDirName, "thumbnail.png");
          const codeLink = `player.html?code=${newDirName}`;
          contentListString += `
<div>
  <p>
    <a href="${codeLink}" target="_blank">${dirName}</a>
  </p>
  <a href="${codeLink}" target="_blank">
    <img src="" data-src="${thumbnailSrc}" alt="" width="150" height="150"/>
  </a>
</div>
`;
          resolve();
        });
      });
    })
  );

  const indexFileNode = parse(srcIndexFileContent);
  appendTargetNode = indexFileNode.querySelector("#content");
  appendTargetNode.set_content(contentListString);

  // index file を書き込み
  fs.writeFile(
    distIndexFilePath,
    indexFileNode.toString(),
    "utf8",
    (err, data) => {
      if (err) throw err;
    }
  );
}

main();
