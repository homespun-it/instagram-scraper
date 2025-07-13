const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();

app.get('/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url || !url.includes('instagram.com/p/')) {
    return res.status(400).json({ error: 'URL non valido' });
  }

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content');
    const image = $('meta[property="og:image"]').attr('content');
    const desc = $('meta[property="og:description"]').attr('content');

    res.json({ title, image, description: desc, source: url });
  } catch (err) {
    res.status(500).json({ error: 'Errore scraping', detail: err.message });
  }
});

module.exports = app;