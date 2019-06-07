'use strict';
const requestPromise = require('request-promise');

//Importing DialogFlow module for AoG library
const { dialogflow } = require('actions-on-google');

//Importing Firebase functions
const functions = require('firebase-functions');

//Instantiate the dialogflow client
const app = dialogflow({ debug: true });

app.intent('City', (conv, { geocity }) => {
    const options = {
        url: `https://api.chucknorris.io/jokes/random`,
        header: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    }

    return requestPromise.get(options).then((res) => {
        console.log(res);
        conv.close(`<speak> ${res.value} </speak>`)
    }).catch((err) => {
        conv.close(`<speak> API isn't responding </speak>`)
    })
});


//Setting up Dialogflowapp object to handle HTTPS POST request
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);