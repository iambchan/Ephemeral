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

function setAMonthDate() {
    var myDate = new Date();
    myDate.setDate(myDate.getDate() + 31);
    $('#send_date').val(myDate.toDateInputValue());
    return false;
}

$(document).ready(function() {
    $('#send_date').val(new Date().toDateInputValue());
});