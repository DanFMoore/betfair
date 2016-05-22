"use strict";

var promisify = require("promisify-node");
var asPromise = require('./as-promise');
var Betfair = promisify('betfair-api-ng');

var betfair;

Betfair.login({
    applicationKey: '',
    username: '',
    password: ''
}).then(function (returnedBetfair) {
    betfair = returnedBetfair;

    return asPromise(betfair.betting.listMarketCatalogue, [{
        filter: {
            eventTypeIds: [1],
            marketStartTime: { from: new Date() },
            marketCountries: ['GB']
        },
        marketProjection: ['EVENT'],
        marketBettingTypes: ['ODDS'],
        maxResults: 20
    }]);
}).then(function (markets) {
    var marketIds = markets.map(market => market.marketId);

    return asPromise(betfair.betting.listMarketBook, [{
        marketIds,
        priceProjection: {
            priceData: ['EX_BEST_OFFERS'],
            exBestOffersOverrides: {
                bestPricesDepth: 2
            }
        }
    }]);
}).then(function (result) {
    console.log(result);
})
.catch(console.error);
