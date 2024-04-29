// // const express = require("express");
// // const puppeteer = require("puppeteer"); // Use puppeteer-core
// // const cheerio = require("cheerio");
// // const cors = require("cors");

// // const app = express();
// // app.use(cors());

// // app.get("", async (req, res) => {
// //   try {
// //     const today = new Date().toISOString().split("T")[0];
// //     const dateFilter = req.query.date || today;

// //     const browser = await puppeteer.launch({
// //       headless: "new",
// //       executablePath:
// //         "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
// //     });

// //     const page = await browser.newPage();

// //     await page.goto(
// //       "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php"
// //     );
// //     await page.waitForTimeout(2000);

// //     await page.$eval(
// //       "#datepicker",
// //       (datepicker, dateFilter) => {
// //         datepicker.value = dateFilter;
// //       },
// //       dateFilter
// //     );

// //     await page.click('input[name="view"]');
// //     await page.waitForTimeout(2000);

// //     const content = await page.content();
// //     const $ = cheerio.load(content);

// //     const exchangeRates = [];

// //     $("table.tbl-responsive tr").each((index, element) => {
// //       if (index > 0) {
// //         const columns = $(element).find("td");
// //         const currency = columns.eq(0).text().trim();
// //         const Symbol = columns.eq(1).text().trim();
// //         const unit = columns.eq(2).text().trim();
// //         const bid = columns.eq(3).text().trim();
// //         const ask = columns.eq(4).text().trim();

// //         exchangeRates.push({ currency, Symbol, unit, bid, ask });
// //       }
// //     });

// //     const officialExchangeRateRow = $('td:contains("Official Exchange Rate")');
// //     const officialExchangeRateText = officialExchangeRateRow.text();
// //     const officialExchangeRateMatch = officialExchangeRateText.match(/(\d+)/);
// //     const officialExchangeRate = officialExchangeRateMatch
// //       ? parseInt(officialExchangeRateMatch[1])
// //       : null;

// //     await browser.close();

// //     const response = {
// //       ok: true,
// //       value: exchangeRates,
// //       officialExchangeRate,
// //       date: dateFilter,
// //     };

// //     res.json(response);
// //   } catch (error) {
// //     console.error("Error:", error);

// //     if (error instanceof puppeteer.errors.TimeoutError) {
// //       res.status(500).json({ error: "Timeout Error" });
// //     } else {
// //       res.status(500).json({ error: "Internal Server Error" });
// //     }
// //   }
// // });
// // const PORT = 5000;
// // app.listen(process.PORT, () => {
// //   console.log(`http://localhost:${PORT}`);
// // });
// // const express = require("express");
// // const puppeteer = require("puppeteer"); // Use puppeteer-core
// // const cheerio = require("cheerio");
// // const cors = require("cors");

// // const app = express();
// // app.use(cors());

// // app.get("/", async (req, res) => {
// //   // Changed the route from "" to "/"
// //   try {
// //     const today = new Date().toISOString().split("T")[0];
// //     const dateFilter = req.query.date || "2024-04-25";

// //     const browser = await puppeteer.launch({
// //       headless: "new", // Changed "new" to true for headless mode
// //       executablePath:
// //         "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
// //     });

// //     const page = await browser.newPage();

// //     await page.goto(
// //       "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php"
// //     );
// //     await page.waitForTimeout(2000);

// //     await page.$eval(
// //       "#datepicker",
// //       (datepicker, dateFilter) => {
// //         datepicker.value = dateFilter;
// //       },
// //       dateFilter
// //     );

// //     await page.click('input[name="view"]');
// //     await page.waitForTimeout(2000);

// //     const content = await page.content();
// //     const $ = cheerio.load(content);

// //     const exchangeRates = [];

// //     $("table.tbl-responsive tr").each((index, element) => {
// //       if (index > 0) {
// //         const columns = $(element).find("td");
// //         const currency = columns.eq(0).text().trim();
// //         const Symbol = columns.eq(1).text().trim();
// //         const unit = columns.eq(2).text().trim();
// //         const bid = columns.eq(3).text().trim();
// //         const ask = columns.eq(4).text().trim();

// //         exchangeRates.push({ currency, Symbol, unit, bid, ask });
// //       }
// //     });

// //     const officialExchangeRateRow = $('td:contains("Official Exchange Rate")');
// //     const officialExchangeRateText = officialExchangeRateRow.text();
// //     const officialExchangeRateMatch = officialExchangeRateText.match(/(\d+)/);
// //     const officialExchangeRate = officialExchangeRateMatch
// //       ? parseInt(officialExchangeRateMatch[1])
// //       : null;

// //     await browser.close();

// //     const response = {
// //       ok: true,
// //       value: exchangeRates,
// //       officialExchangeRate,
// //       date: dateFilter,
// //     };

// //     res.json(response);
// //   } catch (error) {
// //     console.error("Error:", error);

// //     if (error instanceof puppeteer.errors.TimeoutError) {
// //       res.status(500).json({ error: "Timeout Error" });
// //     } else {
// //       res.status(500).json({ error: "Internal Server Error" });
// //     }
// //   }
// // });

// // const PORT = process.env.PORT || 5000; // Changed process.PORT to process.env.PORT
// // app.listen(PORT, () => {
// //   console.log(`Server running on http://localhost:${PORT}`);
// // });

// const express = require("express");
// const puppeteer = require("puppeteer");
// const cheerio = require("cheerio");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.get("/", async (req, res) => {
//   try {
//     const today = new Date().toISOString().split("T")[0];
//     const dateFilter = req.query.date || today;

//     const browser = await puppeteer.launch({
//       headless: true,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//         "--single-process", // Added for Heroku
//       ],
//     });

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
//     const $ = cheerio.load(content);

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

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const app = express();
app.use(cors());

// Your routes and middleware here...

app.get("/", async (req, res) => {
  try {
    // Get the group name from the query parameters
    const groupName = req.query.group;

    const options = {
      uri: "https://www.nbc.gov.kh/english/economic_research/exchange_rate.php",
      transform: function (body) {
        return cheerio.load(body);
      },
    };

    const $ = await requestPromise(options);

    const exchangeRate = $('td:contains("Official Exchange Rate")')
      .text()
      .match(/(\d+)/)[0];
    const exchangeRateAUD = $('td:contains("AUD/KHR")')
      .nextAll("td")
      .eq(1)
      .text();
    const exchangeRateCAD = $('td:contains("CAD/KHR")')
      .nextAll("td")
      .eq(1)
      .text();
    const exchangeRateEUR = $('td:contains("EUR/KHR")')
      .nextAll("td")
      .eq(1)
      .text();

    const response = {
      ok: true,
      value: [
        {
          usd: 1,
          khr: exchangeRate,
          aud: exchangeRateAUD,
          cad: exchangeRateCAD,
          eur: exchangeRateEUR,
        },
      ],
    };

    // Return JSON result
    res.json(response);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(process.env.PORT, () => {
  console.log("listening");
});
