import BasePlugin from "/libs/BasePlugin.js";

export default class GainPlugin extends BasePlugin {
  constructor(audioContext) {
    super(audioContext);
    this.name = "Gain";
    this.gainNode = this.audioContext.createGain();

    // Define the parameters for the UI
    this.parameters = {
      gain: {
        // UI hints
        type: "slider",
        min: 0,
        max: 2,
        step: 0.01,
        unit: "",
        // Initial value
        value: 1.0,
      },
    };

    // Connect internal nodes
    this.input.connect(this.gainNode).connect(this.output);
  }

  setParameter(key, value) {
    if (key === "gain") {
      this.parameters.gain.value = value;
      this.gainNode.gain.setTargetAtTime(
        value,
        this.audioContext.currentTime,
        0.01,
      );
    }
  }

  disconnect() {
    super.disconnect();
    this.gainNode.disconnect();
  }
}
