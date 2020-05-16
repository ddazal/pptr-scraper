const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

class Scraper {
  constructor({ url, selector, domainClass }) {
    this.url = url;
    this.selector = selector;
    this.domainClass = domainClass;
  }

  async scrap(qty = 1) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url, { waitUntil: 'networkidle2' });

    let DOMElementsHandle = await page.$$(this.selector);
    DOMElementsHandle = DOMElementsHandle.slice(0, qty);

    const domainElements = DOMElementsHandle.map(
      (DOMElementHandle) =>
        new this.domainClass(DOMElementHandle, browser)
    );
    return { domainElements, browser };
  }

  async saveData(file, data) {
    const filePath = path.join(__dirname, '..', file);
    let fileData;
    try {
      fileData = await readFile(filePath, 'utf8');
    } catch (error) {
      // File does not exists
      if (error.code === 'ENOENT') {
        await writeFile(filePath, '', 'utf8');
      }
    } finally {
      if (!fileData) {
        await writeFile(filePath, JSON.stringify(data), 'utf8');
        return;
      }
      const fileDataParsed = JSON.parse(fileData);
      const toSave = fileDataParsed.concat(data);
      await writeFile(filePath, JSON.stringify(toSave), 'utf8');
    }
  }
}

module.exports = Scraper;
