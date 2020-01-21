//global variable
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;

//passing the data to the DOM.
let p = document.createElement("p");
const words = document.querySelector(".words");
words.appendChild(p);

recognition.addEventListener("result", e => {
  console.log(e.results);
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("");

  console.log(transcript);

  p.textContent = transcript;
  if (e.results[0].isFinal) {
    p = document.createElement("p");
    words.appendChild(p);
  }

  if (transcript.includes("unicorns")) {
    console.log("UNICORNS");
  }
});

const recButton = document.querySelector("#record");

recButton.addEventListener("click", startRecording);

let isItRecording = false;

//buttons
function startRecording() {
  isItRecording = !isItRecording;

  if (isItRecording) {
    recButton.innerHTML = `<span class="dot"></span> RECORDING...`;
    recognition.start();
    console.log("recording");
    recognition.addEventListener("end", recognition.start);
  } else {
    recButton.innerHTML = `RECORD`;
    recognition.stop();
    console.log("Not recording");
    recognition.removeEventListener("end", recognition.start);
  }
}

/******* PLAYBACK ******/
//uses rate, pitch, and text identifier in the dom
const msg = new SpeechSynthesisUtterance();

let voices = [];
const voicesDropdown = document.querySelector('[name="voice"]');
const speakButton = document.querySelector("#speak");
const stopButton = document.querySelector("#stop");

//identify the voices available, and set it to the dropdown.
function populateVoices() {
  voices = this.getVoices();

  //filter only by english
  const voiceOptions = voices
    // .filter(voice => voice.lang.includes('en'))
    .map(
      voice =>
        `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    )
    .join("");
  voicesDropdown.innerHTML = voiceOptions;
}

//this is to change the voice, and have it play
function setVoice() {
  msg.voice = voices.find(voice => voice.name === this.value);
  playAudio();
}

function playAudio(startOver = true) {
  msg.text = words.textContent;
  // msg.text = "I love Javascript";
  console.log(words.textContent);
  speechSynthesis.cancel();
  if (startOver) {
    speechSynthesis.speak(msg);
    console.log(msg);
  }
}

speechSynthesis.addEventListener("voiceschanged", populateVoices);
voicesDropdown.addEventListener("change", setVoice);

speakButton.addEventListener("click", playAudio);

//You cannot pass a param in a eventlistener. Workarounds.
// stopButton.addEventListener('click', toggle.bind(null, false));
// stopButton.addEventListener('click', function() {
//   toggle(false);
// });
stopButton.addEventListener("click", () => playAudio(false));
