const fs = require("fs");
const path = require("path");
const IOUtils = require("./utils/IOUtils");
const asyncUtils = require("./utils/asyncUtils");
const constants = require("./constants");

async function main() {
  await IOUtils.getFilesInDirectory(constants.srcRootPath, "");
  const dirs = await IOUtils.getDirectories(constants.thumbnailsSrcRootPath);
  await asyncUtils.execPromiseInSequence(
    dirs.map((dir) => async () => {
      return new Promise((resolve, reject) => {
        const srcThumbnailPath = path.join(
          constants.thumbnailsSrcRootPath,
          dir,
          "thumbnail.png"
        );
        const distThumbnailPath = path.join(
          constants.distRootPath,
          "codes",
          dir,
          "thumbnail.png"
        );
        console.log("------------------------");
        console.log(`copy: ${srcThumbnailPath} -> ${distThumbnailPath}`);
        fs.copyFile(srcThumbnailPath, distThumbnailPath, (err) => {
          if (err) {
            console.error(err);
            reject();
            return;
          }
          console.log("copied.");
          resolve();
        });
      });
    })
  );
}

main();
