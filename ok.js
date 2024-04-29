const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const cors = require("cors");
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const dateFilter = req.query.date || today;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto("https://www.nbc.gov.kh/english/economic_research/exchange_rate.php", {
      waitUntil: "domcontentloaded",
    });

    await page.$eval("#datepicker", (datepicker, dateFilter) => {
      datepicker.value = dateFilter;
    }, dateFilter);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click('input[type="submit"][value="View"]'),
    ]);

    const exchangeRates = await page.evaluate(() => {
      const exchangeRates = [];
      const rows = document.querySelectorAll("table.tbl-responsive tr");
      rows.forEach((row, index) => {
        if (index > 0) {
          const columns = row.querySelectorAll("td");
          const currency = columns[0].innerText.trim();
          const symbol = columns[1].innerText.trim();
          const unit = columns[2].innerText.trim();
          const bid = columns[3].innerText.trim();
          const ask = columns[4].innerText.trim();
          exchangeRates.push({ currency, symbol, unit, bid, ask });
        }
      });
      return exchangeRates;
    });

    const officialExchangeRateText = await page.evaluate(() => {
      const officialExchangeRateRow = document.querySelector('td:contains("Official Exchange Rate")');
      return officialExchangeRateRow ? officialExchangeRateRow.textContent.trim() : null;
    });
    const officialExchangeRateMatch = officialExchangeRateText.match(/(\d+)/);
    const officialExchangeRate = officialExchangeRateMatch ? parseInt(officialExchangeRateMatch[1]) : null;

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

    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
