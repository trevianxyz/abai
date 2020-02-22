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

function getEvent(title) {

    var temp = null;

    data.contents.forEach(function(e) {
        if (e.title === title) {
            temp = e;
        }
    })

    return temp;
}

function renderEvent(event) {
    console.log('rendering event ' + event)
    if (typeof event === 'string') {
        console.log('issa string')
        event = getEvent(event);
        console.log(event)
    }

    if (event !== null) {

        if (event.src) {
            document.getElementById('ed-img').src = event.src;
        }

        if (event.title) {
            document.getElementById('ed-title').innerHTML = event.title;
        } else {
            document.getElementById('ed-title').innerHTML = "";
        }

        if (event.subtitle) {
            document.getElementById('ed-subtitle').innerHTML = event.subtitle;
        } else {
            document.getElementById('ed-subtitle').innerHTML = "";
        }

        if (event['event-date']) {
            document.getElementById('ed-date').innerHTML = event['event-date'];
        } else {
            document.getElementById('ed-date').innerHTML = "";
        }

        if (event['event-time']) {
            document.getElementById('ed-time').innerHTML = event['event-time'];
        } else {
            document.getElementById('ed-time').innerHTML = "";
        }

        if (event['event-location']) {
            document.getElementById('ed-location').innerHTML = event['event-location'];
        } else {
            document.getElementById('ed-location').innerHTML = "";
        }

        if (event['event-address']) {
            document.getElementById('ed-address').innerHTML = event['event-address'];
        } else {
            document.getElementById('ed-address').innerHTML = "";
        }

        if (event.body) {
            document.getElementById('ed-body').innerHTML = event.body;
        } else {
            document.getElementById('ed-body').innerHTML = "";
        }

        return 0;
    }

    return -1;
}

function closeEventListings() {
    listings = document.querySelectorAll('.event-listing');
    listings.forEach((l) => l.classList.add('d-none'));
}

function openEventListings() {
    listings = document.querySelectorAll('.event-listing');
    listings.forEach((l) => l.classList.remove('d-none'));
}

domready(function() {
    
    viewBtns = document.querySelectorAll('button.btn-view');

    viewBtns.forEach(function(b) {
        b.addEventListener('click', function(b) {
            result = renderEvent(b.target.dataset.eventTitle);
            if (result === 0) {
                closeEventListings();
            } else {
                alert("Error: this event is currently unavailable.");
            }
        })
    })

})