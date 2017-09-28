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
      firstVisibleNote: 38,
      lastVisibleNote: 89,
      whiteKeyTop: 360,
      whiteKeyBottom: 660,
      unpressedColor: "white",
      channelColors: [
        "purple",
        "blue",
        "green",
        "red",
        "orange"
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