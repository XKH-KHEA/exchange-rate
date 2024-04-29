const express = require("express");
const puppeteer = require("puppeteer"); // Use puppeteer-core
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/OData/ExchangeRateService", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const dateFilter = req.query.date || today;

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      ignoreDefaultArgs: ["--disable-extensions"]
    });

    const page = await browser.newPage();

    await page.goto(
      "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php"
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await page.$eval(
      "#datepicker",
      (datepicker, dateFilter) => {
        datepicker.value = dateFilter;
      },
      dateFilter
    );

    await page.click('input[name="view"]');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const content = await page.content();
    const $ = cheerio.load(content);

    const exchangeRates = [];

    $("table.tbl-responsive tr").each((index, element) => {
      if (index > 0) {
        const columns = $(element).find("td");
        const currency = columns.eq(0).text().trim();
        const Symbol = columns.eq(1).text().trim();
        const unit = columns.eq(2).text().trim();
        const bid = columns.eq(3).text().trim();
        const ask = columns.eq(4).text().trim();

        exchangeRates.push({ currency, Symbol, unit, bid, ask });
      }
    });

    const officialExchangeRateRow = $('td:contains("Official Exchange Rate")');
    const officialExchangeRateText = officialExchangeRateRow.text();
    const officialExchangeRateMatch = officialExchangeRateText.match(/(\d+)/);
    const officialExchangeRate = officialExchangeRateMatch
      ? parseInt(officialExchangeRateMatch[1])
      : null;

    await browser.close();

    const response = {
      ok: true,
      value: exchangeRates,
      officialExchangeRate,
      date: dateFilter,
    };

    res.json(response);
  } catch (error) {
    console.error("Error:", error);

    if (error instanceof puppeteer.errors.TimeoutError) {
      res.status(500).json({ error: "Timeout Error" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
