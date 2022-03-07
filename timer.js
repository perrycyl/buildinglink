const moment = require('moment-timezone');
const { assert } = require('./validations');
const { logger } = require('./logger');
const { info } = require('console');

class DaysConversion {
    /**
    * Takes current days of week input and outputs next their next dates over the next 7 days.
    * Options:
    *   testToday(boo) - takes whatever daysAndTimes user passes and adds today and a set time into the array.
    */

    constructor(targetDay, options = {}) {
        this.options = {}
        this.targetDay = targetDay.toLowerCase() ; //strings
        this.daysOfWeek = [
            'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
            'saturday'];
        this.dtCount = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6
        }
        if (Object.keys(options).length !== 0 && options.constructor == Object){
            if (options['testToday']){
                logger.info('set testToday')
                this.options['testToday'] = true
            }
        }
    };

    static formatDate = (momentDate, type) => {
        /**
         * Arg: 
         *  momentDate(Moment instance): Moment date-time instance
         *  type(str): Two types of values. a) Moment.format date string b)
         *      non-Moment.format string value for special format cases. (ie BLDate to output '[[YYYY/MM/DD]])
         * 
         * Notes:
         * "BLDate": for special building link output of '[[YYYY/MM/DD]]' string
         */
        assert (moment.isMoment(momentDate), "formatDate object is not a moment date.");
        if (type === 'BLDate'){
            let myDatetimeFormat= "YYYY/MM/DD";
            let day = momentDate.format(myDatetimeFormat)
            day = day.split("/");
            day = JSON.stringify([[day[2], day[1], day[0]]])
            return day
        } else {
            return momentDate.format(type)
        }
    };


    get day() {
        return this.__getDates();
    };

    __getDates() {
        // returns a date in Moment instance.
        let count;
        let today = new Date();
        const dayToday = today.getDay(); // string
        
        //Special test cause if options testToday is passed
        logger.info(`IS TESTTODAY: ${this.options['testToday']}`)
        if (this.options['testToday']){
            return this.__Today();
        }

        // Finds the days to count ahead from current day to find the date.
        let dayDiff = this.dtCount[this.targetDay] - dayToday
        
        if (dayDiff <= 0) {
            count = 7 - Math.abs(dayDiff)
        } else {
            count = dayDiff
        }
        
        let day = this.__AddDaysToToday(count);
        return day

    };

    __AddDaysToToday(days) {
        let date = this.__Today();
        date = date.add(days, 'days').startOf('day');
        return date;
    };

    __Today(){
        // Today in moments using EST.
        let date = new Date();
        let myTimezone = "America/Toronto";
        let myDatetimeFormat= "YYYY/MM/DD";
        date = moment(date).tz(myTimezone)
        return date
    }

};

class TimeValidator {
    /**
     * Takes daysAndTimes and checks if task is within 5 seconds.
     * triggers function passed to it if true.
     * args:
     *  momentDTInstance(<moment>): moment instance.
     *  aFunc: Puppeteer function.
     *  arg: List of puppeteer arguments.
     */
    constructor(allDaysAndTimes, callback=undefined, args={}){
        this.aDTs = allDaysAndTimes;
        this.curDate = moment(new Date()).tz('America/Toronto');
        this.callback = callback; //class object for the puppet instance
        this.args = args; //objects using destructuing
    }

    triggerCheck(){
        /**
         * If date matches, run the puppet to sign in and submit request.
         */
        
        for(let el of this.aDTs){
            logger.info(`Is ${el['momentDate']}, test date is ${moment(new Date("2022-03-10")).tz('America/Toronto')}`)
            let testDate = moment(new Date("2022-03-11").toLocaleString("en-US")).tz('America/Toronto')
            if (testDate.isSame(el['momentDate'], 'day')){
                let output = this.callback(el,this.args);
            } else {
                logger.info('pass')
            }
        }
        
        // for(let el of this.aDTs){
        //     assert(moment.isMoment(el['momentDate']), "Not a Moment instance");
        //     if (!this.curDate.isSame(el['momentDate'], 'day')){
        //         logger.info(`Not ${el['momentDate']}`)
        //         continue;
        //     } else {
        //         logger.info(`Is ${el['momentDate']}`)
        //         let output = this.callback(el,this.args);
        //         break;
        //     }
        // }
    }



}


module.exports = {
    DaysConversion,
    TimeValidator
}