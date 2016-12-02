'use_strict'

const axios = require('axios');
const unixTime = require('unix-time');

const utils = require('./Utils');

class Bots {
    
    static * getBtc(params) {
        const res = yield axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${ params }.json`)
            .then(response => {
                const value = response.data.bpi[params].rate;
    
                return {
                    response_type: 'in_channel', // public to the channel
                    text: `The price of 1 bitcoin inwell ${ params } is $${ value }`,
                    attachments: [
                        {
                            image_url: `https://bitcoincharts.com/charts/chart.png?width=940&m=coinbase${ params }&SubmitButton=Draw&r=60&i=&c=0&s=&e=&Prev=&Next=&t=S&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&`
                        }
                    ]
                };
            })
            .catch(error => {
                console.log(error);
                return {
                    response_type: 'in_channel', // public to the channel
                    text: '404 could not find the btc price for that currency'
                };
            }
        );
        
        return res;
    }
    
    static * getGif(params) {
        const res = yield axios.get(`http://api.giphy.com/v1/gifs/search?q=${ params }&api_key=dc6zaTOxFJmzC`)
            .then(response => {
                const rnd = utils.getRand(0, response.data.data.length);
                const img = response.data.data[rnd].images.fixed_height.url.replace(`\/\/`, `//`).replace(`\/`, `/`);
    
                return {
                    response_type: 'in_channel', // public to the channel
                    attachments: [
                        {
                          image_url: img
                        }
                    ]
                };
            })
            .catch(error => {
                console.log(error);
                return {
                    response_type: 'in_channel', // public to the channel
                    text: '404 could not find GIF'
                };
            }
        );
        
        return res;
    }
    
    static * getWeather(params) {
        const location = yield axios.get(`http://maps.googleapis.com/maps/api/geocode/json?address=${ params }`)
            .then(response => {
                const location = response.data.results[0];
                const lat = location.geometry.location.lat;
                const long = location.geometry.location.lng;
    
                return { 
                    latlng: { latitude: lat, longitude: long },
                    city: location.address_components[1].long_name,
                    state: location.address_components[2].short_name,
                    country: location.address_components[3].short_name
                };
            })
            .catch(error => {
                console.log(error);
                return null;
            }
        );
        
        if (location == null) {
            return {
                response_type: 'in_channel', // public to the channel
                text: 'Unable to locate that postal code'
            };
        }
        
        const res = yield axios(`https://api.darksky.net/forecast/91cc800220a3ea89892cc21885b5e6c3/${ location.latlng.latitude },${ location.latlng.longitude }`)
            .then(response => {
                const results = response.data;
                const currently = results.currently;
                const daily = results.daily;
    
                return { 
                    response_type: 'in_channel', // public to the channel
                    text: `Currently, it is ${ currently.temperature }\u2109 (${ currently.summary}) in ${ location.city }, ${ location.state }`,
                    attachments: utils.getDayForecast(daily),
                    footer: 'Dark Sky API',
                    footer_icon: 'http://cdn.appstorm.net/iphone.appstorm.net/files/2012/08/Dark-Sky-Icon.jpg',
                    ts: unixTime(new Date())
                };
            })
            .catch(error => {
                console.log(error);
                return null;
            }
        );
        
        return res;
    }
    
    static * getGoogle(params) {
        const res = yield axios.get(`http://api.giphy.com/v1/gifs/search?q=${ params }&api_key=dc6zaTOxFJmzC`)
            .then(response => {
                const rnd = utils.getRand(0, response.data.data.length);
                const img = response.data.data[rnd].images.fixed_height.url.replace(`\/\/`, `//`).replace(`\/`, `/`);
    
                return {
                    response_type: 'in_channel', // public to the channel
                    attachments: [
                        {
                          image_url: img
                        }
                    ]
                };
            })
            .catch(error => {
                console.log(error);
                return {
                    response_type: 'in_channel', // public to the channel
                    text: '404 could not find GIF'
                };
            }
        );
        
        return res;
    }
}

module.exports = Bots;