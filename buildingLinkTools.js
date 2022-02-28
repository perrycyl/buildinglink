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
        this.dateTime = dAT;
        logger.info(`DAT: ${JSON.stringify(this.dateTime)}`)
        this.__bballReserveLink = "https://opusandomegaonthepark.buildinglink.com/V2/Tenant/Amenities/NewReservation.aspx?amenityId=35375&from=0&selectedDate=";
        this.__loginPage = "http://www.opusandomegaonthepark.ca";
    };
    get triggerReservation (){
        // Returns bool on successful registration.
        return this.__makeReservation();
    }

    get hasCookie (){
        return this.credential.cookie ? true: false;
    }

    makeCookie(){
        return new Promise((resolve, reject) => {
            logger.info(`Credential Puppet: ${JSON.stringify(PuppetBrowser)}`)
            (async () => {
                const browserWSEndpoint = PuppetBrowser.browserWSEndpoint;
                const browser = await puppeteer.connect({browserWSEndpoint})
                const page = await browser.newPage();
                try{
                    await page.goto(this.__loginPage);
                    page.waitForSelector('RememberLogin');
                    await page.type("input[name=Username]", this.credential.username, {delay: 0.5});
                    await page.type("input[name=Password]", this.credential.password, {delay: 0.5});
                    await page.click("#LoginButton");
                    await page.waitForNavigation({
                        waitUntil: 'networkidle0',
                        });
                    logger.info('Got Milk')
                    const cookies = await page.cookies();
                    this.credential.setCookie = cookies;
                    logger.info(`Got Milk: ${this.credential.cookie}`)
                    resolve(this.credential.hasCookie);
                } catch (e) {
                    reject(`Error occurred during cookie fetching: ${e}`)
                } finally {
                    await page.close();
                }
                logger.info('End Credential Puppet')
            })();
        });
        
    };

    __makeReservation(){
        let completed = 0;
        (async () => {
            logger.info("Make Reservation - Launch Browser")
            
            for (dt in this.dateTime['times']){
                const browser = puppeteer.connect({browserWSEndpoint})
                const page = await browser.newPage();
                const reserve = async(tIndex) => {
                    const dt = this.dateTime['times'][dt];
                    await page.goto(this.__bballReserveLink);
                    page.waitForSelector("#ctl00_ContentPlaceHolder1_ctl00_ContentPlaceHolder1_ValidationSummary1Panel");
                    await page.$eval("#ctl00_ContentPlaceHolder1_StartTimePicker_dateInput",
                        el => el.value = dt[0]);
                    await page.$eval("#ctl00_ContentPlaceHolder1_EndTimePicker_dateInput",
                        el => el.value = dt[1]);
                    await page.$eval("#ctl00_ContentPlaceHolder1_StartDatePicker_SD",
                        el => el.value = this.dateTime.date);
                    await page.click('#ctl00_ContentPlaceHolder1_FooterSaveButton')
                    let hasChildren = await page.$eval("#ctl00_ContentPlaceHolder1_ValidationSummary1",
                        el => {return el.hasChildNodes()}
                    );
                    assert(hasChildren, this.dateTime);
                    completed = 1;
                }
                try{
                    reserve(dt);
                    break
                }
                catch (e) {
                    logger.error("reservation failed.")
                    continue
                } finally {
                    await page.close();
                }
            }
            logger.info("Closing Browser");
            logger.info("End make Reservation - Launch Browser");
            return completed;
        })();

    };
}

module.exports = {
    BasketballBLPuppet
}