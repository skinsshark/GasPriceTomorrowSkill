const Alexa = require('alexa-sdk');
const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app = express();

const APP_ID = 'amzn1.ask.skill.e464ee32-2337-4455-81ab-d45abb936bf7';

const responses = {
  STOP_MESSAGE: 'Talk soon!',
  HELP_MESSAGE: 'Ask me for the gas price tomorrow in a specific city',
  LOCATION_ERROR: 'Sorry, I don\'t know about the gas prices in that location',
  LISTEN_ERROR: 'Sorry, I didn\'t hear you correctly',
  CALL_ERROR: 'My apologies, an error occured. Try later',
}

var handlers = {

  'GetGasPriceTomorrow': function () {

    const alexaHandler = this;

    const voiceCity = alexaHandler.event.request.intent.slots.City.value;

    request(url, function(error, response, html) {

      if (!error && response.statusCode == 200) {

        const $ = cheerio.load(html);

        const city = '#' + voiceCity.charAt(0).toUpperCase() + voiceCity.slice(1); // might not need the slice and uppercasing because seems like it figures that out in my custom slot types. leave for now

        const deltaRaw = $(city).parents().eq(2).eq(0).eq(0).text();
        const deltaRegex = /([+-])?\d+(\.\d{1})/g;
        const delta = deltaRaw.match(deltaRegex);

        const verb = { // to describe change of price
          LESS: 'drop',
          EQUAL: 'remain the same',
          MORE: 'go up'
        };

        const info = {
          city: city.slice(1),
          priceTomorrow: delta[1]
        };

        console.log(info);
        alexaHandler.response.speak('The gas price in ' + info.city + ' is expected to i\'m not done this part ' + info.priceTomorrow);
        alexaHandler.emit(':responseReady');
      }

    });

  },
  'Unhandled': function() {
      this.emit(':tell', responses.CALL_ERROR);
  }

};

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};
