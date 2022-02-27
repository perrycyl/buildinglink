const { logger } = require('./logger');
const puppeteer = require('puppeteer');
const { dateInputMgmt } = require('./onStart');
const { basketballBLPuppet } = require('./buildingLinkTools');
const { Credentials } = require('./puppetCredential');
const { TimeValidator } = require('./timer');

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
    {day: "tuesday" , times: [["07:00 PM","08:00 PM"],["08:00 PM", "09:00 PM"]]},
    {day: "sunday" , times: [["11:00 AM","12:00 PM"],["01:00 PM", "02:00 PM"]]}
]

let credentials = new Credentials({
    username: process.env.USERNAME,
    password: process.env.PASSWORD
})

// Code below
const logging = logger()
try {
    dateInputMgmt(daysAndTimes); // Handles all date time inputs manipulates daysAndTimes as needed.
    console.log("Date Time Post setup: ", daysAndTimes);
    console.log("credentials: ", credentials)
    const tv = () =>{
        new TimeValidator(
            daysAndTimes,
            basketballBLPuppet,
            {credentials}
        );
    };
        
    logging.info('before loop')
        
    let runTv = setInterval(
        tv,
        1000
    )

} catch(e) {
    logging.error("Error occurred: ", e);
}

