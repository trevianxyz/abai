// data is event data

console.log("Hello from events.js!");
// console.log(data);

/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {Date[]} List with date objects for each day of the month
 */
function getDaysInMonth(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

var dates = [];
data.contents.forEach(function(e) {
    let d = new Date(e['event-date']);
    if (d != "Invalid Date") {
        dates.push(d);
    }
});