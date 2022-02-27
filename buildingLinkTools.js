const { assert } = require('./validations');
const { logger } = require('./logger');
const puppeteer = require('puppeteer');

const logging = logger()

class basketballBLPuppet{
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
    constructor(dAT, {credential}){
        this.credential = credential;
        this.dateTime = dAT;
        this.__bballReserveLink = "https://opusandomegaonthepark.buildinglink.com/V2/Tenant/Amenities/NewReservation.aspx?amenityId=35375&from=0&selectedDate=";
        this.__loginPage = "http://www.opusandomegaonthepark.ca";
        this.__checkCookie();
        this.__makeReservation()
        
    };

    __checkCookie(){
        if(!this.credential.cookie){
            this.__loginPagePuppet()
        }
    };

    __makeReservation(){
        let completed = 0;
        (async () => {
            logger.info("Launch Browser")
            const browser = await puppeteer.launch;
            const reserve = async() => {
                const page = await browser.newPage();
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
                    el => el.hasChildNodes()
                );
                assert(hasChildren, this.dateTime);

            }

            for (dt of this.dateTime['times']){

                try{
                    reserve();
                    break
                }
                catch (e) {
                    logger.error("reservation failed.")
                    continue
                }
            }

            await browser.close()
            logger.info("Closing Browser")
        })();

    };

    __loginPagePuppet(){
        (async () => {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(this.__loginPage);
            page.waitForSelector('RememberLogin');
            await page.$eval("#Username", el => el.value = this.credential.username);
            await page.$eval("#Password", el => el.value =this.credential.password);
            await page.click("#LoginButton");
            await page.waitForSelector('#leftMenu');
            const cookies = await page.cookies();
            this.credential.setCookie = cookies;
            
            await browser.close()
        })();
    }




}

module.exports = {
    basketballBLPuppet
}