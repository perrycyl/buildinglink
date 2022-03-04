const moment = require('moment-timezone');
const { assert } = require('./validations');
const { logger } = require('./logger');

class DaysConversion {
    /**
    * Takes current days of week input and outputs next their next dates over the next 7 days.
    */

    constructor(targetDay) {
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
    };

    static formatDate = (momentDate) => {
        /**
         * Arg: Moment date-time instance
         * Output: Building link date arr in arr of ints yy,mm,dd
         * Takes a moment date object and formats it to BuildingLink day 
         * ie [[2022,2,23]]
         */
        let myDatetimeFormat= "YYYY/MM/DD";
        assert (moment.isMoment(momentDate), "formatDate object is not a moment date.");
        let day = momentDate.format(myDatetimeFormat)
        day = day.split("/");
        day = [[day[2], day[1], day[0]]]
        return day
    };

    get day() {
        return this.__getDates();
    };

    __getDates() {
        // returns a date in Moment instance.
        let count;
        let today = new Date();
        const dayToday = today.getDay(); // string
        

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
        let date = new Date();
        let myTimezone = "America/Toronto";
        let myDatetimeFormat= "YYYY/MM/DD";
        date = moment(date).tz(myTimezone).add(days, 'days').startOf('day');
        return date;
    };

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
    constructor(allDaysAndTimes, aFunc=undefined, args={}){
        this.aDTs = allDaysAndTimes;
        this.curDate = moment(new Date()).tz('America/Toronto');
        this.aFunc = aFunc; //class object for the puppet instance
        this.args = args; //objects using destructuing
    }

    triggerCheck(){
        /**
         * If date matches, run the puppet to sign in and submit request.
         */
        for(let el of this.aDTs){
            assert(moment.isMoment(el['momentDate']), "Not a Moment instance");
            if (!this.curDate.isSame(el['momentDate'])){
                logger.info(`Not ${el['momentDate']}`)
                continue;
            } else {
                logger.info(`Is ${el['momentDate']}`)
                let output = new this.aFunc(el, this.args);
                break;
            }
        }
    }



}


module.exports = {
    DaysConversion,
    TimeValidator
}