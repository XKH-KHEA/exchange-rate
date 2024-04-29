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

async function scrapeNBC(date) {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate the page to a URL
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

  let data = await page.evaluate(() => {
    let date = document.querySelector(
      "#fm-ex > table > tbody > tr:nth-child(1) > td > font"
    ).innerText;
    let rate = document.querySelector(
      "#fm-ex > table > tbody > tr:nth-child(2) > td > font"
    ).innerText;
    return {
      exchange_date: date,
      exchange_rate: rate,
      currency,
      Symbol,
      unit,
      bid,
      ask,
    };
  });
  await browser.close();
  return data;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
