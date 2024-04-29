const express = require("express");
const cors = require("cors");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const dotenv = require("dotenv").config();

const app = express();
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const dateFilter = req.query.date || today;

    //console.log("Date filter:", dateFilter); // Log date filter to check if it's received correctly

    // const url = `https://www.nbc.gov.kh/english/economic_research/exchange_rate.php?datepicker=${dateFilter}`;
    // console.log("URL:", url); // Log the constructed URL to check if the date filter is appended

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto("https://www.nbc.gov.kh/english/economic_research/exchange_rate.php", { waitUntil: "domcontentloaded" });

    await page.focus("#datepicker");
    await page.keyboard.down("Control");
    await page.keyboard.press("A");
    await page.keyboard.up("Control");
    await page.keyboard.press("Backspace");
    await page.keyboard.type(date);
    await page.click('input[type="submit"]');
    await page.waitForTimeout(2000);

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

    const response = {
      ok: true,
      value: exchangeRates,
      officialExchangeRate,
      date: dateFilter,
    };

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
