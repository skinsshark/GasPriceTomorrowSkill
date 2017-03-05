var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scraper', function(req, res){

  var voiceCity = 'toronto'; // if alexa lowercases
  var city = '#' + voiceCity.charAt(0).toUpperCase() + voiceCity.slice(1);


  url = 'http://www.gasbuddy.com/CAN/ON';

  request(url, function(error, response, html){

    if (!error && response.statusCode == 200) {

      var $ = cheerio.load(html);

      // var location = $('.siteName', city); // city but i mean, just use city variable

      var deltaRaw = $(city).parents().eq(2).eq(0).eq(0).text();
      var deltaRegex = /([+-])?\d+(\.\d{1})/g;
      var delta = deltaRaw.match(deltaRegex);

      var info = {
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
