// const express = require("express");
// const puppeteer = require("puppeteer"); // Use puppeteer-core
// // const cheerio = require("cheerio");
// // const cors = require("cors");
// const PORT = process.env.PORT;
// const app = express();
// // app.use(cors());

// app.get("/", async (req, res) => {
//   // Changed the route from "" to "/"
//   try {
//     const today = new Date().toISOString().split("T")[0];
//     const dateFilter = req.query.date || "2024-04-25";

//     const browser = await puppeteer.launch({ headless: "new" });

//     const page = await browser.newPage();

//     await page.goto(
//       "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php"
//     );
//     await page.waitForTimeout(2000);

//     await page.$eval(
//       "#datepicker",
//       (datepicker, dateFilter) => {
//         datepicker.value = dateFilter;
//       },
//       dateFilter
//     );

//     await page.click('input[name="view"]');
//     await page.waitForTimeout(2000);

//     const content = await page.content();
//     //const $ = cheerio.load(content);

//     const exchangeRates = [];

//     $("table.tbl-responsive tr").each((index, element) => {
//       if (index > 0) {
//         const columns = $(element).find("td");
//         const currency = columns.eq(0).text().trim();
//         const Symbol = columns.eq(1).text().trim();
//         const unit = columns.eq(2).text().trim();
//         const bid = columns.eq(3).text().trim();
//         const ask = columns.eq(4).text().trim();

//         exchangeRates.push({ currency, Symbol, unit, bid, ask });
//       }
//     });

//     const officialExchangeRateRow = $('td:contains("Official Exchange Rate")');
//     const officialExchangeRateText = officialExchangeRateRow.text();
//     const officialExchangeRateMatch = officialExchangeRateText.match(/(\d+)/);
//     const officialExchangeRate = officialExchangeRateMatch
//       ? parseInt(officialExchangeRateMatch[1])
//       : null;

//     await browser.close();

//     const response = {
//       ok: true,
//       value: exchangeRates,
//       officialExchangeRate,
//       date: dateFilter,
//     };

//     res.json(response);
//   } catch (error) {
//     console.error("Error:", error);

//     if (error instanceof puppeteer.errors.TimeoutError) {
//       res.status(500).json({ error: "Timeout Error" });
//     } else {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// });
// // Changed process.PORT to process.env.PORT
// app.listen(PORT, function () {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express = require("express");
const puppeteer = require("puppeteer");
const dotenv = require("dotenv").config();
const app = express();

app.get("/", (req, res) => {
  const date = req.query.date ?? "";
  scrapeNBC(date)
    .then(function (data) {
      res.setHeader("Content-Type", "text/plain");
      res.send(data);
    })
    .catch(function (e) {
      res.status(500, {
        error: e,
      });
    });
});

// async function scrapeNBC(date) {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch({ headless: "new" });
//   const page = await browser.newPage();

//   // Navigate the page to a URL
//   await page.goto(
//     "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php",
//     { waitUntil: "domcontentloaded" }
//   );

//   await page.focus("#datepicker");
//   await page.keyboard.down("Control");
//   await page.keyboard.press("A");
//   await page.keyboard.up("Control");
//   await page.keyboard.press("Backspace");
//   await page.keyboard.type(date);
//   await page.click('input[type="submit"]');

//   let data = await page.evaluate(() => {
//     let date = document.querySelector(
//       "#fm-ex > table > tbody > tr:nth-child(1) > td > font"
//     ).innerText;
//     let rate = document.querySelector(
//       "#fm-ex > table > tbody > tr:nth-child(2) > td > font"
//     ).innerText;
//     return { exchange_date: date, exchange_rate: rate,currency, Symbol, unit, bid, ask};
//   });
//   await browser.close();
//   return data;
// }

async function scrapeNBC(date) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php",
    { waitUntil: "domcontentloaded" }
  );

  await page.focus("#datepicker");
  await page.keyboard.down("Control");
  await page.keyboard.press("A");
  await page.keyboard.up("Control");
  await page.keyboard.press("Backspace");
  await page.keyboard.type(date);
  await page.click('input[type="submit"]');
  await page.waitForTimeout(2000); // Add a delay to ensure the table is fully loaded

  const data = await page.evaluate(() => {
    const exchangeRates = [];
    const rows = document.querySelectorAll("#fm-ex table tbody tr");
    rows.forEach((row) => {
      const columns = row.querySelectorAll("td");
      const currency = columns[0].innerText.trim();
      const symbol = columns[1].innerText.trim();
      const unit = columns[2].innerText.trim();
      const bid = columns[3].innerText.trim();
      const ask = columns[4].innerText.trim();
      exchangeRates.push({ currency, symbol, unit, bid, ask });
    });
    return exchangeRates;
  });

  await browser.close();
  return data;
}

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
