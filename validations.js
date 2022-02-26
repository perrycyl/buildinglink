const { builtinModules } = require("module");

const assert = function(condition, message) {
    if (!condition)
        throw Error('Assert failed: ' + (message || ''));
};

const dateInput = (dateList) => {
    /**
     * Date items should consist of 3 keys.
     * day(str): Day of week. Case is lower. 
     * date(arr): Elements in order of Year, Month, Day of Month.
     * times(arr): Array of array of strings. String is formatted "hh:mm AM/PM". List is start time and end time. 
     */

    assert(typeof dateList['day'] == 'string', 'Input "day" is not a string type.');
    assert(Array.isArray(dateList['date']), 'Input "date" is not an array.');
    assert(Array.isArray(dateList['times']), 'Input "times" is not an array.');
    for (let t in dateList['times']){
        timeInterval(t[0], t[1]);
    };


    const timeInterval = (start, end) => {
        // Time interval cannot be 12pm to 1pm. This time block is invalid.
        // Time needs to be between 9-12pm or 1-9pm

        assert (parseInt(end[1]) - parseInt(start[1]) === 1, "Maximum 1 hr intervals")
        if (start[6] == "P"){
            let hour = parseInt(start[1]);
            assert( hour <= 8 && hour >= 1, "PM start time needs to start between 1 to 8" );
            assert (end[6] == "P", "Midday does not match.");
        } else if (start[6] == "A") {
            let hour = parseInt(start[1]);
            assert( hour <= 12 && hour >= 9, "PM start time needs to start between 1 to 8" );
            assert (end[6] == "A", "Midday does not match.");
        } else {
            throw Error('Error: Midday indicator format is incorrect.')
        }
    }
}

module.exports = {
    assert,
    dateInput
}