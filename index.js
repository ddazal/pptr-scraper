const fs = require('fs');
/*
 * David Daza <03dazal@gmail.com>
 */

const Scraper = require('./lib/scraper');
const P12 = require('./lib/p12');

const scraper = new Scraper({
  url: 'https://www.pagina12.com.ar',
  selector: 'article',
  domainClass: P12,
});

scraper
  .scrap(5)
  .then(async ({ domainElements, browser }) => {
    const articles = [];
    for (const domainElement of domainElements) {
      const url = await domainElement.getURL();
      const title = await domainElement.getTitle();
      const publishedAt = await domainElement.getPublishedTime();
      const scrapedAt = new Date();
      articles.push({ title, url, publishedAt, scrapedAt });
    }
    await browser.close();
    await scraper.saveData('data/p12articles.json', articles);
  })
  .catch(console.log);
