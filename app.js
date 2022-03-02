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

//### USER input ###

// Code below
(async () => {
    // wait for browser to be available
    const waitForBrowser = await PuppetBrowser.create();
    logger.info(`BE: ${JSON.stringify(PuppetBrowser)}`)
    const browserWSEndpoint = PuppetBrowser.browserWSEndpoint; 
    const browser = await puppeteer.connect({browserWSEndpoint})

    let daysAndTimes = [
        {day: "tuesday" , times: [["07:00 PM","08:00 PM"],["08:00 PM", "09:00 PM"]]},
        {day: "sunday" , times: [["11:00 AM","12:00 PM"],["01:00 PM", "02:00 PM"]]}
    ]
    
    let credentials = new Credentials({
        username: process.env.BL_USERNAME,
        password: process.env.BL_PASSWORD,
        cookie: undefined
    });
    // const aBrowser = await makeBrowser();
    
    try {
        dateInputMgmt(daysAndTimes); // Handles all date time inputs manipulates daysAndTimes as needed.
        // logger.info(`Date Time Post setup: ${JSON.stringify(daysAndTimes)}`);
        // logger.info(`credentials: ${JSON.stringify(credentials)}`)    
        // logger.info('before loop');
            
        const bball = new BasketballBLPuppet(daysAndTimes, {credentials});
        await bball.makeCookie();
        // logger.info(`Post cookie run: ${JSON.stringify(credentials.cookie)}`)
        let timeValidator = new TimeValidator(
            daysAndTimes,
            bball.triggerReservation,
            {credentials}
        );

        
    
    } catch(e) {
        logger.error(`Error occurred (app.js):  ${e} \n ${e.stack}`);
    } finally {
        // await aBrowser.close();
        await browser.close()
    }
})();

