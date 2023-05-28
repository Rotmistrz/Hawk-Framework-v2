Hawk.TextManager = {};
Hawk.TextManager.makeLine = function(text) {
    return "<span class=\"line\">" + text + "</span> ";
}
Hawk.TextManager.findWordEnd = function(text, index, backwards) {
    if (typeof backwards == 'undefined') {
        backwards = false;
    }

    if (backwards) {
        var spaceIndex = text.lastIndexOf(" ", index);
    } else {
        var spaceIndex = text.indexOf(" ", index);
    }

    if (spaceIndex < 0) {
        return text.length;
    } else {
        return spaceIndex;
    }
}
Hawk.TextManager.findLine = function(text, start, end) {
    return text.substring(start, end);
}
Hawk.TextManager.makeLines = function(text, lines, backwards, lineLengthOffset) {
    if (typeof backwards == 'undefined') {
        backwards = false;
    }

    if (typeof lineLengthOffset == 'undefined') {
        lineLengthOffset = 0;
    }

    text = text.trim();
    var lineLength = text.length / lines - lineLengthOffset;

    var result = "";
    var breakPosition = 0;
    var start = 0;
    var line = "";

    var i = 1;

    if (text.length > 0) {
        while (i < lines + 1) {
            breakPosition = Hawk.TextManager.findWordEnd(text, lineLength * i, (i == 1 && backwards));
            line = Hawk.TextManager.findLine(text, start, breakPosition);

            line = line.trim();

            if (line.length > 0) {
                result += Hawk.TextManager.makeLine(line);
                start = breakPosition + 1;

                i++;
            } else {
                return Hawk.TextManager.makeLines(text, lines, backwards, lineLengthOffset + 1);
            }
        }
    }

    return result;
}
Hawk.TextManager.makeEqualLines = function(text, lines) {
    var resultText = text.replace("/\s+/", " ");

    var words = resultText.split(' ');

    var wordsInLine = Math.ceil(words.length / lines);

    var result = "";

    for (var i = 0; i < lines; i++) {
        if (i == 0) {
            result += words.slice(0, wordsInLine).join(" ");
        } else {
            result += Hawk.TextManager.makeLine(words.slice(i * wordsInLine, (i + 1) * wordsInLine).join(" "));
        }
    }

    return result;
}