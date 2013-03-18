var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    start_button.style.display = 'inline-block';
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function() {
        recognizing = true;
        start_img.src = 'images/mic-animate.gif';
    };

    recognition.onerror = function(event) {
        if (event.error == 'no-speech') {
            start_img.src = 'images/mic.gif';
            ignore_onend = true;
        }
        if (event.error == 'audio-capture') {
            start_img.src = 'images/mic.gif';
            ignore_onend = true;
        }
        if (event.error == 'not-allowed') {
            ignore_onend = true;
        }
    };

    recognition.onend = function() {
        recognizing = false;
        if (ignore_onend) {
            return;
        }
        start_img.src = 'images/mic.gif';
        if (!final_transcript) {
            return;
        }
    };

    recognition.onresult = function(event) {
        var interim_transcript = '';
        if (typeof(event.results) == 'undefined') {
            recognition.onend = null;
            recognition.stop();
            upgrade();
            return;
        }
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        if (final_transcript.indexOf(match_string) > -1) {
            alert("Next!");
        }
    };
}

function upgrade() {
    start_button.style.visibility = 'hidden';
}

var two_line = /\n\n/g;
var one_line = /\n/g;
function linebreak(s) {
    return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
    return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

function startButton(event) {
    if (recognizing) {
        recognition.stop();
        return;
    }
    final_transcript = '';
    recognition.lang = 'en-CA'; // English Canada
    recognition.start();
    ignore_onend = false;
    start_img.src = 'images/mic-slash.gif';
    start_timestamp = event.timeStamp;
}

var match_string = "next";