require('dotenv').config()

const puppeteer = require('puppeteer');
const { dateInputMgmt } = require('./onStart');
const { BasketballBLPuppet } = require('./buildingLinkTools');
const { Credentials } = require('./puppetCredential');
const { TimeValidator } = require('./timer');
const { logger } = require('./logger');
const { PuppetBrowser } = require('./puppet');

/**
 * 
 * On start, sleep timer creates sleep duration until next run. By taking the
 * least sleep time until next instance.
 * 
 * 
 * Check if logged in, if not, do login.
 * If login success, store cookie for future instances of puppeteer launch.
 * 
 * Go to amenitities page to submit request.
 * Continue all valid submissions until complete. ie. More than one submission
 * in the same day.
 * Check if submission is successful. If not submitted alternative time. Continue
 * until success or all times have been attempted. Log outcome.
 * 
 * Sleep
 */

//### User Input -  START ###

var dat = [
    {day: "thursday" , times: [["9:00 AM","10:00 AM"]], options:{}},
    {day: "sunday" , times: [["11:00 AM","12:00 PM"],["1:00 PM", "2:00 PM"]], options:{}}
];

/**
     * Test options keys:
     *  manual(dictionary object): Hardcoded date time strings, does not generate Moment Instance. 
     *      Needs to pass immutable ie manual['options].
     *  testToday(bool): generates a daysAndTime value for today for testing.
     */
var tv = {};
// var tv = {testToday: true}
// let tv = {
//     manual:{
//         day: "friday",
//         times:[["02:00 PM","03:00 PM"]],
//         date: '[[2022/03/11]]',
//         dateSelector: 'Thursday, March 11, 2022',
//         momentDate: undefined,
//         options: {immutable: true}
//     }
// };

//### User Input -  End ###

// Code below
(async (daysAndTimes, isTest) => {
    // wait for browser to be available
    const waitForBrowser = await PuppetBrowser.create();
    logger.info(`BE: ${JSON.stringify(PuppetBrowser)}`)
    const browserWSEndpoint = PuppetBrowser.browserWSEndpoint; 
    const browser = await puppeteer.connect({browserWSEndpoint})
    
    let credentials = new Credentials({
        username: process.env.BL_USERNAME,
        password: process.env.BL_PASSWORD,
        cookie: undefined
    });
    // const aBrowser = await makeBrowser();
    
    try {
        dateInputMgmt(daysAndTimes, isTest); // Handles all date time inputs manipulates daysAndTimes as needed.
        logger.info(`new DAT: ${JSON.stringify(daysAndTimes)}`)
            
        const bball = new BasketballBLPuppet(daysAndTimes, {credentials});
        await bball.makeCookie();
        logger.info(`Got cookies: ${bball.hasCookie}`)
        let timeValidator = new TimeValidator(
            daysAndTimes,
            bball.makeReservation
        );
        timeValidator.triggerCheck();
    
    } catch(e) {
        logger.error(`Error occurred (app.js):  ${e} \n ${e.stack}`);
    } 
})(dat, tv);

