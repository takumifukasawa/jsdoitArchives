const puppeteer = require("puppeteer");
const path = require("path");
const constants = require("./constants");
const wait = require("./utils/wait");
const IOUtils = require("./utils/IOUtils");
const resolvePath = require("./utils/resolvePath");
const asyncUtils = require("./utils/asyncUtils");

async function capturePage(browser, url, distPath, width, height, delay = 100) {
  let page;
  try {
    page = await browser.newPage();
    await page.setViewport({ width, height });
    await page.goto(url);
    await wait(delay);
    await Promise.race([wait(5000), page.screenshot({ path: distPath })]);
  } catch (e) {
    console.error(e);
  } finally {
    if (page) page.close();
  }
}

async function execCapture(browser, dir, i) {
  const captureUrl = resolvePath.codeAbsolutePath(dir);
  const thumbnailDirPath = path.join(constants.thumbnailsSrcRootPath, dir);
  const ogpPath = path.join(thumbnailDirPath, "ogp.png");
  const thumbnailPath = path.join(thumbnailDirPath, "thumbnail.png");
  await IOUtils.removeDir(thumbnailDirPath);
  await IOUtils.createDir(thumbnailDirPath);
  await wait(1500 * i);
  console.log("----------------------------------");
  console.log(`begin capture: ${captureUrl}`);
  await Promise.all([
    capturePage(browser, captureUrl, ogpPath, 1200, 630, 5000).then(() => {
      console.log(`captured: ${ogpPath}`);
    }),
    capturePage(browser, captureUrl, thumbnailPath, 465, 465, 5000).then(() => {
      console.log(`captured: ${thumbnailPath}`);
    }),
  ]);
}

async function main() {
  const options = {
    headless: true,
  };

  const browser = await puppeteer.launch(options);

  const dirForSingleCode = process.argv[2];

  const codeDirs = !!dirForSingleCode
    ? [dirForSingleCode]
    : IOUtils.getDirectories(path.join(constants.distRootPath, "codes"));

  try {
    await Promise.all(
      // await asyncUtils.execPromiseInSequence(
      codeDirs.map(async (dir, i) => execCapture(browser, dir, i))
      // );
    );
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

main();
