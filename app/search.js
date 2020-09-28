const axios = require("axios");
const querystring = require('querystring');
const redis = require('./redis');

module.exports = {
  googleSearchResults: async (userId, searchString) => {
    const top5Links = [];
    const response = await axios.get('https://www.googleapis.com/customsearch/v1?' + querystring.stringify({ q: searchString, cx: process.env.GOOGLE_SEARCH_CX, key: process.env.GOOGLE_SEARCH_API_KEY }))
      .then(function (res) {
        return res.data;
      })
      .catch(function (error) {
        console.log(error.response.data);
        return error.response.data;
      })
    
    if(response.searchInformation.totalResults < 2){
      return "No Results Found!";
    }

    let redisClient = await redis.connect();
    await redisClient.lpush('DISCORD_' + userId, searchString)
    redisClient.quit();

    for (let index = 0; index < 5; index++) {
      top5Links.push(response.items[index].formattedUrl);
    }

    return top5Links;
  },

  localHistorySearchResults: async (userId, searchString) => {
    const redisClient = await redis.connect();
    const allSearches = await redisClient.lrange('DISCORD_' + userId, 0, -1)
    redisClient.quit();

    const matchedKeys = []

    allSearches.forEach(key => {
      if(key.toLowerCase().search(searchString.toLowerCase()) !== -1){
        matchedKeys.push(key);
      }
    });
    console.log(matchedKeys);
    if(matchedKeys.length === 0){
      return "No Matches Found!";
    }
    return Array.from(new Set(matchedKeys));
  }
} 