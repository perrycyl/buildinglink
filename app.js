const { logger } = require('./logger');
const puppeteer = require('puppeteer');
const {dateInputMgmt} = require('./onStart');

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
let daysAndTimes = [
    {day: "tuesday" , times: [["07:00 PM","08:00 PM"]["08:00 PM", "09:00 PM"]]},
    {day: "sunday" , times: [["11:00 AM","12:00 PM"]["01:00 PM", "02:00 PM"]]}
]


// Code below
logger = logger()
try {
    dateInputMgmt(daysAndTimes); // Handles all date time inputs manipulates daysAndTimes as needed.
    sleepManager() // takes daysAndTimes and sets up sleep schedule
        puppeteerRunner() // Does puppeteer stuff to submit request

} catch(e) {
    logger.err("Error occurred: ", e);
}

