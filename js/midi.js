/**
 * This script automatically attempts to listen on all MIDI inputs and then
 * invokes the globally-scoped noteOn() and noteOff() methods as
 * appropriate.
 **/

var gMidi;

/**
 * Initialize our MIDI hookup by listening for MIDI from all inputs that we
 * can grab.
 * 
 * TODO: Add some UI and persistence of the settings.
 */
function initMidi(midiAccess) {
  gMidi = midiAccess;

  for (let input of gMidi.inputs.values()) {
    console.log("listening to MIDI input", input.name);
    input.onmidimessage = onMidiMessage;
  }

  // TODO: listen on "statechange" event to bind dynamically added devices, etc.
}

const CMD_NOTE_OFF = 8;
const CMD_NOTE_ON = 9;

function onMidiMessage(event) {
  const cmd = event.data[0] >> 4;
  const channel = event.data[0] & 0xf;
  const note = event.data[1];
  const velocity = event.data[2];

  if (cmd === CMD_NOTE_OFF || velocity === 0) {
    noteOff(channel, note);
  } else if (cmd === CMD_NOTE_ON) {
    noteOn(channel, note, velocity);
  } else {
    console.log("other midi command:", cmd);
  }
}

window.addEventListener("load", function() {
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(
      initMidi, (err) => { console.error("midi problem:", err); });
  } else {
    console.error("no MIDI support");
  }
});

