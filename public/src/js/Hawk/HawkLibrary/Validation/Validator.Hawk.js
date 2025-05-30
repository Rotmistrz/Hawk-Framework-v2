const Validator = {};

Validator.isEmail = function (email) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
    return true;
  } else {
    return false;
  }
};


Validator.isPhoneNumber = function (number) {
  if (/^\+?[0-9]{9,}$/.test(number)) {
    return true;
  } else {
    return false;
  }
};

Validator.isNumberPositive = function (number) {
  if (/^[0-9]+((,|\.){1}[0-9]+)?$/.test(number)) {
    number = number.replace(",", ".");

    return parseFloat(number) > 0;
  } else {
    return false;
  }
};

Validator.isNumber = function (number) {
  if (/^[0-9]+$/.test(number)) {
    return true;
  } else {
    return false;
  }
};

Validator.isRationalNumber = function (number) {
  if (/^(\-)?[0-9]+((,|\.)[0-9]+)?$/.test(number)) {
    return true;
  } else {
    return false;
  }
};

Validator.isShortPhoneNumber = function (number) {
  if (/^[0-9\s]+$/.test(number)) {
    number = number.replace("s", "");

    return number.length == 9;
  } else {
    return false;
  }
};

Validator.isNotEmpty = function (value) {
  if (value.trim().length > 0) {
    return true;
  } else {
    return false;
  }
};

Validator.longerThan = function (str, length) {
  if (str.trim().length > length) {
    return true;
  } else {
    return false;
  }
};

Validator.isSomethingChecked = function (field) {
  if (field.is(":checked")) {
    return true;
  } else {
    return false;
  }
};

export default Validator;
