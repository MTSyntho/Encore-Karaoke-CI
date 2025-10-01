import BasePlugin from "/libs/BasePlugin.js";

const WORKLET_PATH = "/pkgs/plugins/processors/NoiseGateProcessor.js";
let isWorkletLoaded = false;

/**
 * Converts a dB value to a linear amplitude value.
 * @param {number} db - The value in decibels.
 * @returns {number} The corresponding linear amplitude.
 */
function dbToLinear(db) {
  return Math.pow(10, db / 20);
}

/**
 * NoiseGatePlugin
 * A classic noise gate based on an AudioWorkletProcessor.
 *
 * Audio Graph:
 * [input] -> [workletNode] -> [output]
 */
export default class NoiseGatePlugin extends BasePlugin {
  // Private constructor. Use the static `create` method instead.
  constructor(audioContext, workletNode) {
    super(audioContext);
    this.name = "Noise Gate";
    this.workletNode = workletNode;

    // Define the parameters for the UI. Note these are in user-friendly units (dB, ms).
    this.parameters = {
      threshold: {
        type: "slider",
        min: -100,
        max: 0,
        step: 1,
        unit: "dB",
        value: -50,
      },
      attack: {
        type: "slider",
        min: 1,
        max: 200,
        step: 1,
        unit: "ms",
        value: 5,
      },
      release: {
        type: "slider",
        min: 10,
        max: 1000,
        step: 10,
        unit: "ms",
        value: 100,
      },
    };

    // Connect the graph
    this.input.connect(this.workletNode).connect(this.output);
  }

  /**
   * Asynchronous factory method for creating an instance of the NoiseGatePlugin.
   * This is necessary because we need to load the AudioWorklet module before instantiation.
   */
  static async create(audioContext) {
    if (!isWorkletLoaded) {
      try {
        await audioContext.audioWorklet.addModule(WORKLET_PATH);
        isWorkletLoaded = true;
        console.log(
          "[FORTE SVC] NoiseGateProcessor worklet loaded successfully.",
        );
      } catch (e) {
        console.error(
          `[FORTE SVC] Failed to load NoiseGateProcessor worklet from ${WORKLET_PATH}`,
          e,
        );
        // Return a dummy object or throw an error to prevent the app from breaking
        throw e;
      }
    }

    const workletNode = new AudioWorkletNode(
      audioContext,
      "noise-gate-processor",
    );
    return new NoiseGatePlugin(audioContext, workletNode);
  }

  /**
   * Sets a parameter. Converts UI-friendly values (dB, ms) to the linear/seconds
   * values required by the AudioWorkletProcessor.
   */
  setParameter(key, value) {
    if (!this.workletNode) return;

    const param = this.workletNode.parameters.get(key);
    if (!param) return;

    // Store the UI value
    this.parameters[key].value = value;

    let processedValue = value;
    // Convert values to the format the processor expects
    if (key === "threshold") {
      processedValue = dbToLinear(value);
    } else if (key === "attack" || key === "release") {
      processedValue = value / 1000; // ms to seconds
    }

    param.setTargetAtTime(processedValue, this.audioContext.currentTime, 0.01);
  }

  disconnect() {
    super.disconnect();
    if (this.workletNode) {
      this.workletNode.disconnect();
    }
  }
}
