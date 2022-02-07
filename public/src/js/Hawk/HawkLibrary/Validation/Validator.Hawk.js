Hawk.Validator = {};

Hawk.Validator.isEmail = function(email) {
	if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isPhoneNumber = function(number) {
    if (/^\+?[0-9]+[0-9\s]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isNumber = function(number) {
    if (/^[0-9]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isShortPhoneNumber = function(number) {
    if (/^[0-9\s]+$/.test(number)) {
        number = number.replace("\s", "");

        return number.length == 9;
    } else {
        return false;
    }
}

Hawk.Validator.isNotEmpty = function(value) {
    if (value.trim().length > 0) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.longerThan = function(str, length) {
    if (str.trim().length > length) {
        return true;
    } else {
        return false;
    }
}

Hawk.Validator.isSomethingChecked = function(field) {
    if (field.is(':checked')) {
        return true;
    } else {
        return false;
    }
}