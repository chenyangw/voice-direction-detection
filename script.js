var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = ["left", "right"];

var resultPara = document.querySelector(".result");
var diagnosticPara = document.querySelector(".output");
var leftPara = document.querySelector(".left");
var rightPara = document.querySelector(".right");

var testBtn = document.querySelector("button");

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  var direction = "unknown";

  testBtn.disabled = true;
  testBtn.textContent = "Test in progress";
  resultPara.textContent = "Left or Right?";
  resultPara.style.background = "rgba(0,0,0,0.2)";
  diagnosticPara.textContent = "...diagnostic messages";

  const grammar = `#JSGF V1.0; grammar phrase; public <color> = ${phrases.join(
    " | "
  )};`;
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = "Speech received: " + speechResult + ".";
    if (phrases.includes(speechResult)) {
      resultPara.textContent = "Direction detected: " + speechResult;
      resultPara.style.background = "lime";
      if (speechResult === "left") {
        direction = "left";

        leftPara.style.background = "lime";
        rightPara.style.background = "rgba(0,0,0,0.2)";
      } else {
        direction = "right";

        rightPara.style.background = "lime";
        leftPara.style.background = "rgba(0,0,0,0.2)";
      }
    } else {
      resultPara.textContent =
        'No direction detected. Say "left" or "right" to try again.';
      resultPara.style.background = "red";
      leftPara.style.background = "rgba(0,0,0,0.2)";
      rightPara.style.background = "rgba(0,0,0,0.2)";
    }

    console.log("---\ndirection: ", direction, "\n---");
    console.log("Confidence: " + event.results[0][0].confidence);
  };

  recognition.onspeechend = function () {
    recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = "Start new test";
  };

  recognition.onerror = function (event) {
    testBtn.disabled = false;
    testBtn.textContent = "Start new test";
    diagnosticPara.textContent =
      "Error occurred in recognition: " + event.error;
  };

  recognition.onaudiostart = function (event) {
    //Fired when the user agent has started to capture audio.
    console.log("SpeechRecognition.onaudiostart");
  };

  recognition.onaudioend = function (event) {
    //Fired when the user agent has finished capturing audio.
    console.log("SpeechRecognition.onaudioend");
  };

  recognition.onend = function (event) {
    //Fired when the speech recognition service has disconnected.
    console.log("SpeechRecognition.onend");
  };

  recognition.onnomatch = function (event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log("SpeechRecognition.onnomatch");
  };

  recognition.onsoundstart = function (event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log("SpeechRecognition.onsoundstart");
  };

  recognition.onsoundend = function (event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log("SpeechRecognition.onsoundend");
  };

  recognition.onspeechstart = function (event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log("SpeechRecognition.onspeechstart");
  };
  recognition.onstart = function (event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log("SpeechRecognition.onstart");
  };

  return direction;
}

testBtn.addEventListener("click", testSpeech);
