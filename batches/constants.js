const path = require("path");

const srcRootPath = path.join(process.cwd(), "src");

const archivesSrcRootPath = path.join(srcRootPath, "archives");

const thumbnailsSrcRootPath = path.join(srcRootPath, "thumbnails");

const distRootPath = path.join(process.cwd(), "docs");

exports.srcRootPath = srcRootPath;

exports.archivesSrcRootPath = archivesSrcRootPath;

exports.thumbnailsSrcRootPath = thumbnailsSrcRootPath;

exports.distRootPath = distRootPath;
