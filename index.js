const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const config = require('./config.json');

const app = express();
app.use(bodyParser.json()); // Support JSON Encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // Support encoded bodies

/*
 * ---------------------------
 * Start Routes
 * ---------------------------
 */

// Zach's GIF Bot
app.post('/gifbot', (req, res) => {
    const user = req.body.user_name;
    const text = req.body.text;
    const channel = req.body.channel_name;
    
    let data = null;
    
    axios.get(`http://api.giphy.com/v1/gifs/search?q=${ text }&api_key=dc6zaTOxFJmzC`)
        .then(response => {
            const img = response.data.data[0].images.fixed_height.url.replace(`\/\/`, `//`).replace(`\/`, `/`);

            data = {
                response_type: 'in_channel', // public to the channel
                text: 'Houston, we found a GIF',
                attachments: [
                    {
                      image_url: img
                    }
                ]
            };
    
            res.json(data);
        })
        .catch(error => {
            data = {
                response_type: 'in_channel', // public to the channel
                text: '404 could not find GIF'
            };
    
            res.json(data);
        }
    );
    
    // Don't put a return here or any type of response.
    });

// Zach's BTC Bot
app.post('/btcbot', (req, res) => {
    const user = req.body.user_name;
    const text = req.body.text.toUpperCase();
    const channel = req.body.channel_name;
    
    let data = null;
    
    axios.get(`https://api.coindesk.com/v1/bpi/currentprice/${ text }.json`)
        .then(response => {
            const value = response.data.bpi[text].rate;

            data = {
                response_type: 'in_channel', // public to the channel
                text: `The price of 1 bitcoin in ${ text } is $${ value }`,
                attachments: [
                    {
                        image_url: `https://bitcoincharts.com/charts/chart.png?width=940&m=coinbase${ text }&SubmitButton=Draw&r=60&i=&c=0&s=&e=&Prev=&Next=&t=S&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&`
                    }
                ]
            };
    
            res.json(data);
        })
        .catch(error => {
            data = {
                response_type: 'in_channel', // public to the channel
                text: '404 could not find the btc price for that currency'
            };
    
            res.json(data);
        }
    );
    
    // Don't put a return here or any type of response.
});

/*
 * ---------------------------
 * /End Routes
 * ---------------------------
 */

// Set port & listen
app.set('port', (process.env.PORT || config.site.port));
app.listen(app.get('port'), () => {
	console.log(config.site.name + " running on port " + app.get('port'));
});
