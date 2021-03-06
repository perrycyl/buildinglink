const { dateInput } = require('./validations');
const { DaysConversion } = require('./timer');
const { logger } = require('./logger');

// Polyfill trigger
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const dateInputMgmt = (dts, options = {}) => {
    if (Object.keys(options).length !== 0 && options.constructor == Object){
        logger.info("Options triggered")
        if ('testToday' in options){
            // inserts todays date into daysAndTimes
            const daysOfWeek = [
                'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
                'saturday'];
            let today = new Date();
            const dayToday = today.getDay()
            dts.push({day: daysOfWeek[dayToday] , times: [["07:00 PM","08:00 PM"],["08:00 PM", "09:00 PM"]], options:{testToday: true}})
        } else if ('manual' in options){
            dts.push(options['manual'])
        }
    }
    for (let dt of dts){
        if ('immutable' in dt['options'] && dt['options']['immutable']){
            continue;
        };
        let date = new DaysConversion(dt['day'], dt['options']);
        date = date.day;
        dt['date'] = DaysConversion.formatDate(date, "YYYY/MM/DD");
        dt['momentDate'] = date;
        dt['dateSelector'] = DaysConversion.formatDate(date, "dddd, MMMM DD, YYYY")
        dateInput(dt); // throws errors if date input is invalid.
    }
};

module.exports ={
    dateInputMgmt
}