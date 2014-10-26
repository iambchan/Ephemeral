// Timezone support
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

function setTodaysDate() {
    $('#send_date').val(new Date().toDateInputValue());
    return false;
}

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

var appState = {};

$(document).ready(function() {
    $('#send_date').val(new Date().toDateInputValue());
    appState.currentDate = new Date();
});