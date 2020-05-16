class P12 {
  constructor(DOMElementHandle, browser, page) {
    this.DOMElementHandle = DOMElementHandle;
    this.browser = browser;
  }

  async getURL() {
    const anchorTag = await this.DOMElementHandle.$('a');
    this.url = await anchorTag.evaluate((node) => node.href);
    return this.url;
  }

  async getTitle() {
    const title = await this.DOMElementHandle.evaluate(
      (node) => node.innerText
    );
    return title;
  }

  async getPublishedTime() {
    const page = await this.browser.newPage();
    await page.goto(this.url, { waitUntil: 'networkidle2' });

    const timeElementHandle = await page.$('.time');
    const time = await timeElementHandle.evaluate((node) => node.innerText);

    await page.close();

    return time;
  }
}

module.exports = P12;
