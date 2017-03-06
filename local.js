// old working version that is run locally, figuring out index.js

const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

app.get('/scraper', function(req, res){

  const voiceCity = 'toronto'; // if alexa lowercases
  const city = '#' + voiceCity.charAt(0).toUpperCase() + voiceCity.slice(1);


  const url = 'http://www.gasbuddy.com/CAN/ON';

  request(url, function(error, response, html) {

    if (!error && response.statusCode == 200) {

      const $ = cheerio.load(html);

      // var location = $('.siteName', city); // city but i mean, just use city variable

      const deltaRaw = $(city).parents().eq(2).eq(0).eq(0).text();
      const deltaRegex = /([+-])?\d+(\.\d{1})/g;
      const delta = deltaRaw.match(deltaRegex);

      const info = {
        city: city.slice(1),
        priceTomorrow: delta[1]
      };

      console.log(info);
    }

  })
})

app.listen('8081')
console.log("Running");
exports = module.exports = app;
