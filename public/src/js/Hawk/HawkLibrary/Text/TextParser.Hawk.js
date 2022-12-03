Hawk.TextParser = {};

Hawk.TextParser.replaceAll = function(text, characters) {
    for (let i in characters) {
        text = text.replace(new RegExp(i, "g"), characters[i]);
    }

    return text;
}

Hawk.TextParser.transferPolishCharactersIntoLatin = function(text) {
    const equivalents = {
        'ą': 'a',
        'Ą': 'A',
        'ć': 'c',
        'Ć': 'C',
        'ę': 'e',
        'Ę': 'E',
        'ł': 'l',
        'Ł': 'L',
        'ń': 'n',
        'Ń': 'N',
        'ó': 'o',
        'Ó': 'O',
        'ś': 's',
        'Ś': 'S',
        'ź': 'z',
        'Ź': 'Z',
        'ż': 'z',
        'Ż': 'Z'
    };

    text = Hawk.TextParser.replaceAll(text, equivalents);

    return text;
}

Hawk.TextParser.preparePlainPath = function(text) {
    text = Hawk.TextParser.transferPolishCharactersIntoLatin(text.trim());

    const equivalents = {
        ' - ': '-',
        '- ': '-',
        ' -': '-'
    };

    text = Hawk.TextParser.replaceAll(text, equivalents);

    const specialCharacters = {
        ' ': '-',
        '&nbsp;': '-'
    };

    text = Hawk.TextParser.replaceAll(text, specialCharacters);

    text = text.replace(new RegExp("[^a-zA-Z0-9_\\-\/=\.&%\?\(\)]+", "g"), "").toLowerCase();

    if (text.length > 0) {
        return text;
    } else {
        return "-";
    }
}
