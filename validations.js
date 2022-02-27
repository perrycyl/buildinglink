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
    console.log("dateList: ", dateList);
    assert(typeof dateList['day'] == 'string', 'Input "day" is not a string type.');
    assert(Array.isArray(dateList['date']), 'Input "date" is not an array.');
    assert(Array.isArray(dateList['times']), 'Input "times" is not an array.');
    for (let t in dateList['times']){
        __timeInterval(dateList['times'][t][0], dateList['times'][t][1]);
    };
}

const __timeInterval = (start, end) => {
    // args:
    //  start(str): start time
    //  end(str): end time
    // Time interval cannot be 12pm to 1pm. This time block is invalid.
    // Time needs to be between 9-12pm or 1-9pm

    assert (parseInt(end[1]) - parseInt(start[1]) === 1, "Maximum 1 hr intervals")
    // if (start[6] == "P"){
    //     let hour = parseInt(start[1]);
    //     console.log("HOUR: ", hour)
    //     assert( hour <= 8 && hour >= 1, "PM start time needs to start between 1 to 8" );
    //     assert (end[6] == "P", "Midday does not match.");
    // } else if (start[6] == "A") {
    //     let sHour = parseInt(start[1]);
    //     let sTenHour = parseInt(start[0])
    //     assert( sHour >= 1 && sHour <= 9, "AM start time needs to start between 1 to 8" );
    //     assert (end[6] == "A", "Midday does not match.");
    // } else {
    //     throw Error('Error: Midday indicator format is incorrect.')
    // }
}

module.exports = {
    assert,
    dateInput
}