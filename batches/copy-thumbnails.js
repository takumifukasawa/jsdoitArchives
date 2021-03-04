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

        const srcOgpPath = path.join(
          constants.thumbnailsSrcRootPath,
          dir,
          "ogp.png"
        );
        const distOgpPath = path.join(
          constants.distRootPath,
          "codes",
          dir,
          "ogp.png"
        );

        console.log("------------------------");
        console.log(`copy: ${srcThumbnailPath} -> ${distThumbnailPath}`);
        fs.copyFileSync(srcThumbnailPath, distThumbnailPath);
        console.log(`copy: ${srcOgpPath} -> ${distOgpPath}`);
        fs.copyFileSync(srcOgpPath, distOgpPath);
        resolve();
      });
    })
  );
}

main();
