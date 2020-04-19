var currentConfig;

var chan = new BroadcastChannel("keyboard");
chan.addEventListener("message", function({ data }) {
  switch (data.type) {
    case "hello":
      // Automatically reply to hello messages with our current configuration.
      chan.postMessage({ type: "config", payload: currentConfig });
      break;
  }
});

function ensureConfig() {
  if (!currentConfig) {
    currentConfig = {
      projectorTransform: "",
      numWhiteKeys: 40,
      paddingLeft: 502,
      paddingRight: 48,
      firstVisibleNote: 21,
      centerVisibleNote: 71,
      blackKeyLabelsTop: 440,
      whiteKeyLabelsTop: 494,
      perspectiveFactor: 0.3,
      lastVisibleNote: 108,
      blackKeyTop: 0,
      blackKeyBottom: 1200,
      whiteKeyTop: 0,
      whiteKeyBottom: 1200,
      unpressedColor: "rgba(255, 255, 255, 0)",
      channelColors: [
        "violet",
        "dodgerblue",
        "lime",
        "lightcoral",
        "orange",
        "gold",
        "aquamarine",
        "orchid",
        "bisque",
        "lightpink",
        "yellowgreen",
        "powderblue",
        "peachpuff",
        "lightskyblue"
      ]
    };
  }
}
ensureConfig();

function noteOn(channel, note, velocity) {
  console.log("noteOn", channel, note, velocity);
  chan.postMessage({
    type: "set-keys",
    payload: [
      { channel, note, velocity }
    ]
  });
}

// XXX maybe just collapse noteOff into noteOn unless some better rationale
// shows up for the semantics.
function noteOff(channel, note) {
  console.log("noteOff", channel, note);
  chan.postMessage({
    type: "set-keys",
    payload: [
      { channel, note, velocity: 0 }
    ]
  });
}