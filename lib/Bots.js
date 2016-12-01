'use_strict'

const axios = require('axios');

class Bots {
    
    static * getBtc(params) {
        const res = yield axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${ params }.json`)
            .then(response => {
                const value = response.data.bpi[params].rate;
    
                return {
                    response_type: 'in_channel', // public to the channel
                    text: `The price of 1 bitcoin in ${ params } is $${ value }`,
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
                const rnd = this.getRand(0, response.data.data.length);
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
                return {
                    response_type: 'in_channel', // public to the channel
                    text: '404 could not find GIF'
                };
            }
        );
        
        return res;
    }
    
    static getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

module.exports = Bots;