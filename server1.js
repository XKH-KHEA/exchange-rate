const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const fetchDataForDate = async (dateFilter) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
    );

    await page.goto(
      "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php"
    );

    await page.waitForSelector("#datepicker");

    await page.$eval(
      "#datepicker",
      (datepicker, dateFilter) => {
        datepicker.value = dateFilter;
      },
      dateFilter
    );

    await Promise.all([
      page.click('input[name="view"]'),
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    await page.waitForSelector("table.tbl-responsive");

    const content = await page.content();
    const $ = cheerio.load(content);

    const officialExchangeRateRow = $('td:contains("Official Exchange Rate")');
    const officialExchangeRateText = officialExchangeRateRow.text();
    const officialExchangeRateMatch = officialExchangeRateText.match(/(\d+)/);
    const officialExchangeRate = officialExchangeRateMatch
      ? parseInt(officialExchangeRateMatch[1])
      : null;

    await browser.close();

    return {
      officialExchangeRate,
      date: dateFilter,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = {
  fetchDataForDate,
};
