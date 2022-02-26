const moment = require('moment-timezone');

Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    let myTimezone = "America/Toronto";
    let myDatetimeFormat= "YYYY/MM/DD";
    date = moment(date).tz(myTimezone).add(days, 'days').format(myDatetimeFormat);
    console.log('proto 0: ', date)
    return date;
}

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
    }

    get day() {
        return this.getDates();
    }

    getDates() {
        // returns a date.
        let count;
        let today = new Date();
        const dayToday = today.getDay() // int
        

        // Finds the days to count ahead from current day to find the date.
        let dayDiff = this.dtCount[this.targetDay] - dayToday
        
        if (dayDiff <= 0) {
            count = 7 - Math.abs(dayDiff)
        } else {
            count = dayDiff
        }
        
        let day = new Date()
        day = day.addDays(count);
        console.log(day)
        day = day.split("/")
        day = [day[2], day[1], day[0]]
        return day

    }
};

class SleepMaker {
    /**
     * Takes daysAndTimes and finds the next closest day.
     * 
     */
}


module.exports = {
    DaysConversion
}