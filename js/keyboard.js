var chan = new BroadcastChannel("keyboard");
chan.addEventListener("message", function({ data }) {
  console.log("received message", data);
  switch (data.type) {
    case "config":
      updateConfig(data.payload);
      break;
    case "set-keys":
      setKeyStates(data.payload);
      break;
  }
});
chan.postMessage({ type: "hello" });

var currentConfig = null;

/**
 * Setup and render the keyboard.
 */
function updateConfig(config) {
  currentConfig = config;
  renderKeyboard();
}

// XXX okay, yeah, maybe a library would be a smart thing to use...
const PHASE_INFO = [
  { white: 0,    black: null, name: "C" },
  { white: null, black: 0,    name: "C#" },
  { white: 1,    black: null, name: "D" },
  { white: null, black: 1,    name: "D#" },
  { white: 2,    black: null, name: "E" },
  { white: 3,    black: null, name: "F" },
  { white: null, black: 3,    name: "F#" },
  { white: 4,    black: null, name: "G" },
  { white: null, black: 4,    name: "G#" },
  { white: 5,    black: null, name: "A" },
  { white: null, black: 5,    name: "A#" },
  { white: 6,    black: null, name: "B"}
];

function getNoteInfo(note) {
  const octave = Math.floor(note / 12) - 1;
  const phase = note % 12;
  const info = PHASE_INFO[phase];
  const whiteIndex = info.white + (octave + 1) * 7;
  return {
    octave,
    phase,
    whiteIndex,
    info,
  };
}

function renderKeyboard() {
  const root = document.getElementById("keyboard-container");
  console.log("set keyboard container class to", root.className);

  // clear any existing DOM we built.
  root.innerHTML = "";

  const containerHeight = root.clientHeight;
  const containerWidth = root.clientWidth;

  const { firstVisibleNote, lastVisibleNote } = currentConfig;
  const numWhiteKeys = getNoteInfo(lastVisibleNote).whiteIndex -
                       getNoteInfo(firstVisibleNote).whiteIndex + 1;
  console.log("Rendering", numWhiteKeys, "white keys.");

  let iWhite = 0;
  for (let note = firstVisibleNote; note <= lastVisibleNote; note++) {
    const { octave, phase, info } = getNoteInfo(note);

    // skip black keys for now
    if (info.white === null) {
      continue;
    }

    const leftShift = currentConfig.paddingLeft + currentConfig.perspectiveFactor * (currentConfig.centerVisibleNote - firstVisibleNote);
    const keyboardWidth = containerWidth - (currentConfig.paddingLeft + currentConfig.paddingRight) -
          currentConfig.perspectiveFactor * (currentConfig.centerVisibleNote - firstVisibleNote);
    
    const perspectiveOffset = (note - currentConfig.centerVisibleNote) * currentConfig.perspectiveFactor;

    const x1 = leftShift + keyboardWidth * iWhite / numWhiteKeys + perspectiveOffset;
    const x2 = leftShift + keyboardWidth * (iWhite + 1) / numWhiteKeys + perspectiveOffset;
    const key = document.createElement("div");
    key.id = "note" + note;
    key.style.position = "absolute";
    key.style.top = currentConfig.whiteKeyTop + "px";
    key.style.left = x1 + "px";
    key.style.width = (x2 - x1) + "px";
    key.style.height = (currentConfig.whiteKeyBottom - currentConfig.whiteKeyTop) + "px";
    key.style.backgroundColor = currentConfig.unpressedColor;
    //key.style.border = "2px solid blue";

    const keyLabel = document.createElement("div");
    keyLabel.innerText = info.name;
    keyLabel.style.position = "absolute";
    keyLabel.style.top = currentConfig.keyLabelsTop + "px";
    keyLabel.style.left = x1 + "px";
    keyLabel.style.width = (x2 - x1) + "px";
    keyLabel.style.height = "20px";
    keyLabel.style.textAlign = "center";

    root.appendChild(key);
    root.appendChild(keyLabel);
    iWhite++;
  }
}

function setKeyStates(keyStates) {
  for (let { channel, note, velocity} of keyStates) {
    const key = document.getElementById("note" + note);
    if (!key) {
      console.log("no 'note" + note + "' element");
      continue;
    }

    if (velocity) {
      console.log("setting key", key, "to", currentConfig.channelColors[channel]);
      key.style.backgroundColor = currentConfig.channelColors[channel];
    } else {
      key.style.backgroundColor = currentConfig.unpressedColor;
    }
  }
}