var Hawk = {};

Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,

    anchorSuffix: '-anchor',
}

Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};

Hawk.getLocation = function() {
    return window.location;
}

Hawk.getPath = function() {
    return Hawk.getLocation().pathname;
}

Hawk.getHash = function() {
    return Hawk.getLocation().hash;
}

Hawk.anchorRegex = new RegExp("^[^\/]+$");

Hawk.getPreparedHash = function(withoutLeadingHashSign) {
    if (typeof withoutLeadingHashSign == 'undefined' || !withoutLeadingHashSign) {
        const regexp = new RegExp("[^a-zA-Z0-9\-_]+", 'g');

        return this.getHash().replaceAll(regexp, "");
    } else {
        return this.getHash().substring(1).replaceAll('/', '');
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

Hawk.createStringFromBundle = function(bundle) {
    var parts = [];

    for (var i in bundle) {
        console.log(i + "=" + bundle[i]);
        parts.push(i + "=" + bundle[i]);
    }

    return parts.join('&');
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

Hawk.jQueryFromString = function(html) {
    return $(html).filter(function() {
        return this.nodeType != 3; // Node.TEXT_NODE
    });
}

Hawk.scrollToElement = function(options) {
    const defaultOptions = {
        container: window,
        anchor: '#top' + Hawk.anchorSuffix,
        callback: function() {},
        delay: 0,
        duration: 800,
        offset: 0
    };

    options = Hawk.mergeObjects(defaultOptions, options);

    const offset = (typeof options.offset == 'function') ? options.offset() : options.offset;

    setTimeout(function(){
        $(options.container).scrollTo(options.anchor, options.duration, {'axis': 'y', 'offset': offset, onAfter: function() { options.callback(); } });
    }, options.delay);

    return this;
}