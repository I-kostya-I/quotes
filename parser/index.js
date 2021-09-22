const puppeteer = require('puppeteer');
const userAgent = require('user-agents');
const keys = require('../api/config')
const axios = require('axios')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

const period = 15
let browser
let activePages = []
let pagesOpenTime

const usAgent = new userAgent();

const openBroser = async () => {
  try {
    browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true
    });
  } catch (err) {
    log.Fatal('Ошибка создания браузера', 'parser', 'openBroser', err.toString());
  }
}

const openPage = async (url) => {
  try {
    const page = await browser.newPage();
    await page.setUserAgent(usAgent.toString());

    await page.goto(url);
    await page.waitForSelector('#scr-res-table');
    return page
  } catch (err) {
    log.Fatal('Ошибка открытия страниц', 'parser', 'openPage', err.toString());
  }
}

const sendQuotes = async (data) => {
  try {
    const options = {
      baseURL: keys.BASE_URL,
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + keys.PARSER },
      url: "/api/quotes",
      data: {
        quotes: data
      }
    }

    await axios(options)
  } catch (err) {
    log.Fatal('Ошибка отправки данных в API', 'parser', 'sendQuotes', err.toString());
  }
}

const parsePages = async () => {
  try {
    activePages.forEach(async function (actives, i, arr) {

      let data = await actives.page.$$eval('#scr-res-table > div > table > tbody > tr', tr => {
        return tr.map(el => {
          return {
            alias: el.querySelector('a').textContent,
            price: el.querySelector('[aria-label="Price (Intraday)"]').textContent,
            change : el.querySelector('[aria-label="Change"]').textContent,
            change_p : el.querySelector('[aria-label="% Change"]').textContent,
          }
        })
      })

      sendQuotes(data)
    });
  } catch (err) {
    log.Fatal('Ошибка', 'parser', 'parsePages', err.toString());
  }
}

const closePages = async () => {
  try {
    activePages.forEach(async function (actives, i, arr) {
      await actives.page.close()
    })
  } catch (err) {
    log.Fatal('Ошибка', 'parser', 'closePages', err.toString());
  }
}

const checkTime = async (time) => {
  try {
    if (time == 0) { await closePages(); activePages = []; event() }
    else { parsePages() }
  } catch (err) {
    log.Fatal('Ошибка', 'parser', 'checkTime', err.toString());
  }
}

const event = async () => {
  try {
    if (!browser) { await openBroser() }

    if (activePages.length == 0) {

      const options = {
        baseURL: keys.BASE_URL,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + keys.PARSER },
        url: "/api/config?type=links"
      }

      let links = await axios(options)
      links = links.data.links.map(el => el.link)

      for (link in links) {
        activePages.push({
          page: await openPage(links[link])
        });
      }

      pagesOpenTime = new Date().getMinutes()

      parsePages()
    } else {
      let currTime = new Date().getMinutes()

      currTime > pagesOpenTime
        ? checkTime((currTime - pagesOpenTime) % period)
        : checkTime((60 - pagesOpenTime + currTime) % period)
    }
  } catch (err) {
    log.Fatal('Ошибка', 'parser', 'event', err.toString());
  }
}

const init = () => {
  try {
    event()
    setInterval(() => event(), 60000);
  } catch (err) {
    log.Fatal('Ошибка инизиализации', 'parser', 'init', err.toString());
  }
}

init()