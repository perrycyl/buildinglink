const { assert } = require('./validations');
const { logger } = require('./logger');
const { PuppetBrowser } = require('./puppet');
const puppeteer = require('puppeteer');

class BasketballBLPuppet{
    /**
     * If cookie in Credentials is not available, do login.
     * Else, check if registration page loaded. If it is not available, load
     * login page and stay signed in. Get cookie and update Crednetials with it.
     * Go to registration page, update fields and submit. If errors pops up,
     * update fields with next set of times and submit. Try until success or
     * no more times in array.
     * 
     * Update date value to the next date this should run.
     */
    constructor(dAT, {credentials}){
        logger.info("Starting BasketballBLPuppet");
        this.credential = credentials;
        this.__bballReserveLink = "https://opusandomegaonthepark.buildinglink.com/V2/Tenant/Amenities/NewReservation.aspx?amenityId=35375&from=0&selectedDate=";
        this.__loginPage = "http://www.opusandomegaonthepark.ca";
    };
    get hasCookie (){
        return this.credential.cookie ? true: false;
    }

    makeCookie(){
        return new Promise(async(resolve, reject) => {

                const browserWSEndpoint = PuppetBrowser.browserWSEndpoint;
                const browser = await puppeteer.connect({browserWSEndpoint})
                const page = await browser.newPage();
                try{
                    await page.goto(this.__loginPage);
                    await page.waitForSelector('#RememberLogin');
                    await page.type("input[name=Username]", this.credential.username, {delay: 3});
                    await page.type("input[name=Password]", this.credential.password, {delay: 3});
                    await page.waitForSelector('#LoginButton')
                    await page.click("#LoginButton");
                    await page.waitForSelector('#leftMenu')
                    logger.info('Got Milk')
                    const cookies = await page.cookies();
                    this.credential.setCookie = cookies;
                    logger.info(`Got Milk: ${this.credential.cookie}`)
                    resolve(this.credential.hasCookie);
                } catch (e) {
                    reject(`Error occurred during cookie fetching: ${e}`)
                } finally {
                    await page.close();
                    logger.info('End Credential Puppet')
                }

        });
        
    };

    async makeReservation(dateTime){
        /**
         * Takes a single date time entry and reserves a court time as requested.
         * Arg:
         *  datetime(obj): Single day and time object.
         */
        function* getTime(times){
            yield* times
        }

        const reserve = (page, timeList) => {
            logger.info(`Reserve: ${typeof timeList}${timeList}`)
            return new Promise( async (res, rej) => {
                try {
                    logger.info(`hello: ${JSON.stringify(this)}`)
                    logger.info(`Reserve2: ${typeof timeList}${timeList}`)
                    await page.goto("https://opusandomegaonthepark.buildinglink.com/V2/Tenant/Amenities/NewReservation.aspx?amenityId=35375&from=0&selectedDate=");
                    let hasChildren = await page.$eval("#ctl00_ContentPlaceHolder1_ValidationSummary1",
                        el => {return el.children.length > 0 }
                    );
                    logger.info(`Has Children 1: ${hasChildren}`)
                    // click date in calendar corresponding
                    await page.waitForSelector(`td[title='${dateTime["dateSelector"]}']`);
                    await page.click(`td[title='${dateTime["dateSelector"]}']`);
                    await page.waitForTimeout(4000);
                    
                    // click time input
                    await page.waitForSelector(`#ctl00_ContentPlaceHolder1_StartTimePicker_dateInput`);
                    await page.click(`#ctl00_ContentPlaceHolder1_StartTimePicker_dateInput`);
                    /**
                     * we could wait until id="ctl00_ImgLoadingPanelRoller" disappears as a wait for.
                     */
                    await page.waitForTimeout(4000);

                    // click time to select
                    await page.waitForSelector(`.RadCalendarPopup`);
                    const [element] = await page.$x(`//a[@href='#'][text()='${timeList[0]}']`)
                    await element.click();
                    await page.waitForTimeout(8000);


                    // await page.$eval("#ctl00_ContentPlaceHolder1_StartTimePicker_dateInput",
                    //     (el, timeList) => {
                    //         el.value = timeList[0]
                    //     },
                    //     timeList
                    //     );
                    // await page.$eval("#ctl00_ContentPlaceHolder1_EndTimePicker_dateInput",
                    //     (el, timeList) => {
                    //         el.value = timeList[1]
                    //     },
                    //     timeList
                    //     );

                    await page.click('#ctl00_ContentPlaceHolder1_FooterSaveButton')
                    hasChildren = await page.$eval("#ctl00_ContentPlaceHolder1_ValidationSummary1",
                        el => {return el.children.length > 0}
                    );
                    res(hasChildren)
                } catch (e) {
                    logger.error(`Error running reserve function: ${e}. \n${e.stack}`);
                    rej('Reserve went wrong!')
                }
            })
        }

        let completed = 0;
        const browserWSEndpoint = PuppetBrowser.browserWSEndpoint;
        logger.info(`BrowserEP: ${browserWSEndpoint}`)
        logger.info(`MR dt: ${JSON.stringify(dateTime['times'])}`)

        const browser = await puppeteer.connect({browserWSEndpoint})

        try{
            logger.info(`Browser: ${browser}`)
            // Transform this block to away for loop returning Promise
            for (let i=0; i < dateTime['times'].length; i++ ){
                logger.info(`Trying ${dateTime['times'][i]}`)
                const page = await browser.newPage();
                try{
                    const hasChildren = await reserve(page, dateTime['times'][i]);
                    logger.info(`hasChildren: ${hasChildren}`)
                    if (hasChildren){
                        logger.error(`${dateTime['times'][i]} of ${dateTime['day']} is not available`)
                        continue
                    }
                    completed = 1;
                    break
                }
                catch (e) {
                    logger.error(`Error during reservation process: ${e} \n ${e.stack}`)
                    continue
                } finally {
                    await page.close();
                    logger.info("Closing Page");
                }
            }
            return {success: completed};
        } catch (e){
            throw new Error(`makeReservation breaks: ${e} \n ${e.stack}`)
        }


    };
}

module.exports = {
    BasketballBLPuppet
}