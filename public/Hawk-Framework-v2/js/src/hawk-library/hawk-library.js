var Hawk = {};

Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,

    hash: window.location.hash,
    anchorSuffix: '-anchor',
}

Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};

Hawk.anchorRegex = new RegExp("^[^\/]+$");

Hawk.getPreparedHash = function(withoutLeadingHashSign) {
    if (typeof withoutLeadingHashSign == 'undefined' || !withoutLeadingHashSign) {
        return this.hash.replaceAll('/', '');
    } else {
        return this.hash.substring(1).replaceAll('/', '');
    }
}

Hawk.isInObject = function(value, obj) {
    for (var k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue;
        }

        if (obj[k] === value) {
            return true;
        }
    }

    return false;
}

Hawk.createBundleFromString = function(str) {
    var parts = str.split('&');

    var result = {};

    var current;
    var data;
    var key;
    var value;

    for (var i in parts) {
        current = parts[i];

        data = current.split('=');

        key = data[0];
        value = data[1];

        result[key] = value;
    }

    return result;
}

Hawk.mergeObjects = function(mainObject, object) {
    var result = {};

    if (object === undefined) {
        return mainObject;
    }

    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = (object.hasOwnProperty(property)) ? object[property] : mainObject[property];
        }

        //console.log("object." + property + ": " + result[property]);
    }

    return result;
}

Hawk.mergeWholeObjects = function(mainObject, object) {
    var result = {};

    if (object === undefined) {
        return mainObject;
    }

    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = mainObject[property];
        }


        //console.log("object." + property + ": " + result[property]);
    }

    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            result[property] = object[property];
        }

        //console.log("object." + property + ": " + result[property]);
    }

    return result;
}

Hawk.addZeros = function (number, digits) {
    number = number + "";

    for (var i = 1; i <= digits; i++) {
        if (number.length < digits) {
            number = "0" + number;
        }
    }

    return number;
}