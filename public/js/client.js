// Timezone support
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
};

function addDays(numDays) {
    var selectedDate = appState.currentDate;
    appState.currentDate = selectedDate.addDays(numDays);
    updateView();
    return false;
}

function updateView() {
    $('#send_date').val(appState.currentDate.toDateInputValue());
}

function setTodaysDate() {
    appState.currentDate = new Date();
    updateView();
    return false;
}

var appState = {};

$(document).ready(function() {
    setTodaysDate();
    // Set the timezone offset value for server to use
    $('#timezone_offset').val(new Date().getTimezoneOffset()); 

    // Update app state whenever user changes the date in the input
    $('#send_date').blur(function(e) {
        appState.currentDate = new Date($('#send_date').val());
    });
});


