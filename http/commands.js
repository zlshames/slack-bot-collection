const utils = require('./utils')
const fetch = require('node-fetch')

class Commands {

    static async bitcoin(input) {
        let response = {}
        let currency = 'usd'
        let days = 1

        // Parse request input
        if (input) {
            const inputSplit = input.split(' ')

            if (inputSplit[0]) {
                if (isInteger(inputSplit[0])) {
                    days = inputSplit[0]
                } else {
                    currency = inputSplit[0]
                }
            }

            if (inputSplit[1]) {
                days = inputSplit[1]
            }  
        }

        try {
            // Make request
            const res = await fetch(`https://api.coindesk.com/v1/bpi/currentprice/${ currency }.json`)
            const body = await res.json()

            // Parse response
            const rate = body.bpi[currency.toUpperCase()].rate
            const value = rate.substring(0, rate.indexOf('.') + 3)
            response = utils.buildResponse('in_channel', value, {
                'attachments': [{
                    'image_url': `https://bitcoincharts.com/charts/chart.png?width=940&m=bitstamp${ currency.toUpperCase() }&SubmitButton=Draw&r=${ days }&i=&c=0&s=&e=&Prev=&Next=&t=S&b=&a1=&m1=10&a2=&m2=25&x=0&i1=&i2=&i3=&i4=&v=1&cv=0&ps=0&l=0&p=0&`
                }]
            })
        } catch (err) {
            response = utils.buildResponse('ephemeral', `The following error occurred: ${ err }`)
        }

        return response
    }

    static async gif(input) {
        let response = {}

        try {
            // Make request
            const res = await fetch(`http://api.giphy.com/v1/gifs/search?q=${ input }&api_key=dc6zaTOxFJmzC`)
            const body = await res.json()

            let index = 5
            if (body.data.length < index) {
                index = body.data.length
            }

            const rnd = utils.getRand(0, index)
            response = utils.buildResponse('in_channel', null, {
                'attachments': [{
                    'image_url': body.data[rnd].images.fixed_height.url.replace(`\/\/`, `//`).replace(`\/`, `/`)
                }]
            })
        } catch (err) {
            response = utils.buildResponse('ephemeral', `The following error occurred: ${ err }`)
        }

        return response
    }

    static async weather(input) {
        let response = {}

        try {
            // Make request
            let res = await fetch(`http://maps.googleapis.com/maps/api/geocode/json?address=${ input }`)
            let body = await res.json()

            const location = body.results[0]
            const lat = location.geometry.location.lat
            const long = location.geometry.location.lng

            if (!location) {
                response = utils.buildResponse('ephemeral', `Unable to locate address: ${ input }`)
            } else {
                res = await fetch(`https://api.darksky.net/forecast/91cc800220a3ea89892cc21885b5e6c3/${ lat },${ long }?units=auto`)
                body = await res.json()

                const currently = body.currently
                const daily = body.daily
                const unit = (body.flags.units == 'us') ? '\u2109' : '\u2103'
            
                response = utils.buildResponse(
                    'in_channel',
                    `Currently, it is ${ currently.temperature }${ unit } (${ currently.summary}) in ${ location.formatted_address }`,
                    {
                        'attachments': utils.getDayForecast(daily, unit),
                        'footer': 'Dark Sky API',
                        'footer_icon': 'http://cdn.appstorm.net/iphone.appstorm.net/files/2012/08/Dark-Sky-Icon.jpg',
                        'ts': new Date().toDateString()
                    }
                )
            }
        } catch (err) {
            response = utils.buildResponse('ephemeral', `The following error occurred: ${ err }`)
        }

        return response
    }
}

module.exports = Commands