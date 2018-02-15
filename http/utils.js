class Utils {

    static buildResponse(channel, text) {
        return this.buildResponse(channel, text, {})
    }

    static buildResponse(channel, text, extra_params) {
        let output = {'response_type': channel}

        if (text) {
            output['text'] = text
        }

        for (let key in extra_params) {
            if (!output.hasOwnProperty(key)) {
                output[key] = extra_params[key]
            }
        }

        return output
    }

    static getRand(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static getDayForecast(daily, unit) {
        let output = [];
        
        for (let i = 0; i < 6; i++) {
            output.push({
                fallback: `Failed to get weather information`,
                text: `<http://google.com|${ this.getDay(i) }> - ${ daily.data[i].summary }`,
                fields: [
                    {
                        title: 'High',
                        value: `${ daily.data[i].temperatureMax }${ unit }`,
                        short: true
                    },
                    {
                        title: 'Low',
                        value: `${ daily.data[i].temperatureMin }${ unit }`,
                        short: true
                    }
                ],
                color: this.weatherToColor(daily.data[i].summary)
                
            });
        }
        
        return output;
    }
    
    static getDay(val) {
        const currDate = new Date();
        currDate.setDate(currDate.getDate() + val);
        
        switch (currDate.getDay()) {
            case 0 : return 'Sunday';
            case 1 : return 'Monday';
            case 2 : return 'Tuesday';
            case 3 : return 'Wednesday';
            case 4 : return 'Thursday';
            case 5 : return 'Friday';
            case 6 : return 'Saturday';
            default : return 'Unknown';
        }
    }
    
    static weatherToColor(type) {
        if (type.toLowerCase().indexOf('rain') !== -1) {
            return '#719ACA';
        } else if (type.toLowerCase().indexOf('clear') !== -1) {
            return '#AAD4FF';
        } else if (type.toLowerCase().indexOf('cloud') !== -1) {
            return '#787878';   
        } else if (type.toLowerCase().indexOf('sun') !== -1) {
            return '#FFE793';   
        } else if (type.toLowerCase().indexOf('storm') !== -1) {
            return '#FF5555';  
        } else {
            return '#FF7F2A';
        }
    }

    static isInt(value) {
        return !isNaN(value) && 
                parseInt(Number(value)) == value && 
                !isNaN(parseInt(value, 10));
    }
}

module.exports = Utils