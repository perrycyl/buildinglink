const { dateInput } = require('./validations');
const { DaysConversion } = require('./timer');

// Polyfill trigger
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const dateInputMgmt = (dts) => {
    for (let dt of dts){
        let date = new DaysConversion(dt['day']);
        date = date.day;
        dt['date'] = DaysConversion.formatDate(date);
        dt['momentDate'] = date;
        dateInput(dt); // throws errors if date input is invalid.
    }
};

module.exports ={
    dateInputMgmt
}