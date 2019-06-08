'use strict';
const requestPromise = require('request-promise');

//Importing DialogFlow module for AoG library
const { dialogflow,
        BasicCard,
        Image } = require('actions-on-google');

//Importing Firebase functions
const functions = require('firebase-functions');

//Instantiate the dialogflow client
const app = dialogflow({ debug: true });

//WelcomeIntent
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(`Welcome to Weather App. May I know which city weather you would like to know?`)
});

//Image URLs
const clearImg = 'http://tmglive.tv/wp-content/uploads/2017/06/Sunny-clear-weather.jpeg';
const rainImg = 'https://www.scienceabc.com/wp-content/uploads/2015/05/Walking-in-Rain.jpg';
const cloudsImg = 'https://www.theglobeandmail.com/resizer/BGOzSdJP1VNRXJ9GCYbW9-VYtAk=/1200x0/filters:quality(80)/arc-anglerfish-tgam-prod-tgam.s3.amazonaws.com/public/5EG236O7RVH4LKH7RRD4SR5NPI';
const hazeImg = 'https://www.healthhub.sg/sites/assets/Assets/Article%20Images/respiratory_haze.jpg?Width=970&Height=405';
const mistImg = 'https://graffitiwallpaper.com/pics/listings/139_wide.jpg';
const thunderstormImg = 'http://images.skymetweather.com/content/wp-content/uploads/2016/04/Thundershowers-2.jpg';
const drizzleImg = 'http://www.whitneydrake.com/wp-content/uploads/2012/11/drizzle-11292012.jpg';

//Intent
app.intent('City', (conv, { geocity }) => {
    const options = {
        url: `http://api.openweathermap.org/data/2.5/weather?q=${geocity}&appid=322ae2f731aa7597aa477091ce1c6564`,
        header: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }

    return requestPromise.get(options).then((res) => {
        console.log(res);
        conv.ask(`<speak>The weather of ${geocity} is ${res.weather[0].main}</speak >`);
        conv.ask(`<speak>The temperature is ${Math.floor(res.main.temp - 273)} degree celcius,
            <break time = "200ms"/>
            
            <break time = "300ms"/> Do you want to check another City?
            </speak>`);

        if (res.weather[0].main === 'Clear') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${clearImg}`,
                    alt: 'Clear'
                })
            }))
        }

        else if (res.weather[0].main === 'Clouds') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${cloudsImg}`,
                    alt: 'Cloudy'
                })
            }))
        }

        else if (res.weather[0].main === 'Drizzle') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${drizzleImg}`,
                    alt: 'Drizzle'
                })
            }))
        }

        else if (res.weather[0].main === 'Thunderstorm') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${thunderstormImg}`,
                    alt: 'Thunderstorms'
                })
            }))
        }

        else if (res.weather[0].main === 'Haze') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${hazeImg}`,
                    alt: 'Haze'
                })
            }))
        }

        else if (res.weather[0].main === 'Mist') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${mistImg}`,
                    alt: 'Mist'
                })
            }))
        }

        else if (res.weather[0].main === 'Rain') {
            conv.ask(new BasicCard({
                text: `${res.weather[0].main}`,
                image: new Image({
                    url: `${rainImg}`,
                    alt: 'Rainy'
                })
            }))
        }

    }).catch((err) => {
        conv.close(`<speak> API isn't responding </speak>`);
    })
});


//Setting up Dialogflowapp object to handle HTTPS POST request
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);