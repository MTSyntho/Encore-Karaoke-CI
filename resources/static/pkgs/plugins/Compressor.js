import BasePlugin from "/libs/BasePlugin.js";

/**
 * CompressorPlugin
 * A classic vocal compressor with input gain, standard compressor controls, and make-up gain.
 *
 * Audio Graph:
 * [input] -> [inputGain] -> [compressorNode] -> [outputGain] -> [output]
 */
export default class CompressorPlugin extends BasePlugin {
  constructor(audioContext) {
    super(audioContext);
    this.name = "Compressor";

    // --- Create Web Audio Nodes for the effect ---

    // Gain before the compressor to drive the signal harder or softer into it.
    this.inputGain = this.audioContext.createGain();

    // The core Web Audio API compressor node.
    this.compressorNode = this.audioContext.createDynamicsCompressor();

    // Gain after the compressor to make up for volume lost during compression.
    this.outputGain = this.audioContext.createGain();

    // --- Define the parameters for the UI ---
    this.parameters = {
      inputGain: {
        type: "slider",
        min: -24,
        max: 24,
        step: 0.1,
        unit: "dB",
        value: 0,
      },
      threshold: {
        type: "slider",
        min: -100,
        max: 0,
        step: 1,
        unit: "dB",
        value: -24, // A common starting point for vocals
      },
      ratio: {
        type: "slider",
        min: 1,
        max: 20,
        step: 0.1,
        unit: ":1",
        value: 4, // A 4:1 ratio is typical for vocals
      },
      attack: {
        type: "slider",
        min: 0,
        max: 200,
        step: 1,
        unit: "ms",
        value: 5, // A fast attack to catch vocal peaks
      },
      release: {
        type: "slider",
        min: 10,
        max: 1000,
        step: 10,
        unit: "ms",
        value: 250, // A moderate release
      },
      outputGain: {
        type: "slider",
        min: -24,
        max: 24,
        step: 0.1,
        unit: "dB",
        value: 0,
      },
    };

    // --- Set initial values from the parameters object ---
    this.updateAllParameters();

    // --- Connect the audio graph ---
    this.input
      .connect(this.inputGain)
      .connect(this.compressorNode)
      .connect(this.outputGain)
      .connect(this.output);
  }

  /**
   * Helper function to convert dB to linear gain.
   * @param {number} db - The value in decibels.
   * @returns {number} The corresponding linear gain value.
   */
  dbToLinear(db) {
    return Math.pow(10, db / 20);
  }

  /**
   * Sets all underlying AudioParam values from the plugin's parameters object.
   */
  updateAllParameters() {
    this.inputGain.gain.value = this.dbToLinear(
      this.parameters.inputGain.value,
    );
    this.compressorNode.threshold.value = this.parameters.threshold.value;
    this.compressorNode.ratio.value = this.parameters.ratio.value;
    this.compressorNode.attack.value = this.parameters.attack.value / 1000; // ms to seconds
    this.compressorNode.release.value = this.parameters.release.value / 1000; // ms to seconds
    this.outputGain.gain.value = this.dbToLinear(
      this.parameters.outputGain.value,
    );
  }

  /**
   * Called by the Forte engine when a UI control is changed.
   */
  setParameter(key, value) {
    if (this.parameters[key] === undefined) return;

    const now = this.audioContext.currentTime;
    const smoothTime = 0.02;

    // Store the new UI-friendly value
    this.parameters[key].value = value;

    switch (key) {
      case "inputGain":
        this.inputGain.gain.setTargetAtTime(
          this.dbToLinear(value),
          now,
          smoothTime,
        );
        break;
      case "threshold":
        this.compressorNode.threshold.setTargetAtTime(value, now, smoothTime);
        break;
      case "ratio":
        this.compressorNode.ratio.setTargetAtTime(value, now, smoothTime);
        break;
      case "attack":
        // Convert from milliseconds (UI) to seconds (Web Audio API)
        this.compressorNode.attack.setTargetAtTime(
          value / 1000,
          now,
          smoothTime,
        );
        break;
      case "release":
        // Convert from milliseconds (UI) to seconds (Web Audio API)
        this.compressorNode.release.setTargetAtTime(
          value / 1000,
          now,
          smoothTime,
        );
        break;
      case "outputGain":
        this.outputGain.gain.setTargetAtTime(
          this.dbToLinear(value),
          now,
          smoothTime,
        );
        break;
    }
  }

  disconnect() {
    super.disconnect();
    this.inputGain.disconnect();
    this.compressorNode.disconnect();
    this.outputGain.disconnect();
  }
}
