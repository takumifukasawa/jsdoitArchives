const puppeteer = require("puppeteer");
const path = require("path");
const IOUtils = require("./utils/IOUtils");
const asyncUtils = require("./utils/asyncUtils");
const constants = require("./constants");

const options = {
  headless: true,
};

const codeDirs = IOUtils.getDirectories(
  path.join(constants.distRootPath, "codes")
);

async function capturePage(browser, url, distPath, delay = 100) {
  let page;
  try {
    page = await browser.newPage();
    await page.setViewport({ width: 465, height: 465 });
    await page.goto(url);
    await wait(delay);
    await Promise.race([wait(5000), page.screenshot({ path: distPath })]);
  } catch (e) {
    console.error(e);
  } finally {
    if (page) page.close();
  }
}

async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(ms);
    }, ms);
  });
}

async function main() {
  const browser = await puppeteer.launch(options);
  try {
    // await asyncUtils.execPromiseInSequence(
    // );
    await Promise.all([
      codeDirs.map(async (dir) => {
        const captureUrl = `https://takumifukasawa.github.io/jsdoitArchives/codes/${dir}/`;
        const thumbnailPath = path.join(
          constants.distRootPath,
          "codes",
          dir,
          "thumbnail.png"
        );
        console.log("----------------------------------");
        console.log(`capture: ${captureUrl} -> ${thumbnailPath}`);
        await capturePage(
          browser,
          `https://takumifukasawa.github.io/jsdoitArchives/codes/${dir}/`,
          thumbnailPath,
          3000
        );
        console.log(`captured.`);
      }),
    ]);
  } catch (e) {
    console.error(e);
  } finally {
    await browser.close();
  }
}

main();
