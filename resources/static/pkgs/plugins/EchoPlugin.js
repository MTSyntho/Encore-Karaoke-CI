import BasePlugin from "/libs/BasePlugin.js";

/**
 * EchoPlugin
 * A classic feedback delay effect for the Forte engine.
 *
 * Audio Graph:
 *
 *             [dryGain] ------------------------------------->
 *               ^                                              |
 *               |                                              |
 * [input] ->----|                                              v
 *               |                                          [output]
 *               |                                              ^
 *               v                                              |
 *             [delayNode] -> [wetGain] ------------------------>
 *                  ^      |
 *                  |      |
 *                  <------< [feedbackGain] <--------------------
 */
export default class EchoPlugin extends BasePlugin {
  constructor(audioContext) {
    super(audioContext);
    this.name = "Echo";

    // --- Create Web Audio Nodes for the effect ---

    // The core node that creates the delay. Max delay of 2 seconds.
    this.delayNode = this.audioContext.createDelay(2.0);

    // Controls how much of the delayed signal is fed back into the delay node.
    this.feedbackGain = this.audioContext.createGain();

    // Controls the volume of the original, unprocessed signal.
    this.dryGain = this.audioContext.createGain();

    // Controls the volume of the delayed (echo) signal.
    this.wetGain = this.audioContext.createGain();

    // --- Define the parameters that the UI can control ---
    this.parameters = {
      time: {
        type: "slider",
        min: 0,
        max: 2,
        step: 0.01,
        unit: "s", // seconds
        value: 0.4, // A sensible default
      },
      feedback: {
        type: "slider",
        min: 0,
        // NOTE: Max is < 1.0 to prevent runaway feedback that gets infinitely louder.
        max: 0.95,
        step: 0.01,
        unit: "%", // We'll treat this as a percentage in the UI
        value: 0.5,
      },
      mix: {
        type: "slider",
        min: 0,
        max: 1,
        step: 0.01,
        unit: "%", // Dry/Wet mix percentage
        value: 0.35, // Default to a subtle echo
      },
    };

    // --- Set initial values from the parameters object ---
    this.delayNode.delayTime.value = this.parameters.time.value;
    this.feedbackGain.gain.value = this.parameters.feedback.value;

    // The mix parameter controls two gains in opposite directions.
    this.dryGain.gain.value = 1.0 - this.parameters.mix.value;
    this.wetGain.gain.value = this.parameters.mix.value;

    // --- Connect the audio graph ---
    // 1. Split the input signal to the dry path and the delay path.
    this.input.connect(this.dryGain);
    this.input.connect(this.delayNode);

    // 2. The feedback loop: connect the delay's output back to its input via the feedback gain.
    this.delayNode.connect(this.feedbackGain);
    this.feedbackGain.connect(this.delayNode);

    // 3. Connect the dry and wet signals to the main output.
    this.dryGain.connect(this.output);
    this.delayNode.connect(this.wetGain);
    this.wetGain.connect(this.output);
  }

  /**
   * Called by the Forte engine when a UI control is changed.
   * @param {string} key - The name of the parameter to change (e.g., 'time').
   * @param {number} value - The new value from the UI.
   */
  setParameter(key, value) {
    // Use a smooth transition to avoid audio clicks
    const now = this.audioContext.currentTime;
    const smoothTime = 0.02;

    switch (key) {
      case "time":
        this.parameters.time.value = value;
        this.delayNode.delayTime.setTargetAtTime(value, now, smoothTime);
        break;

      case "feedback":
        this.parameters.feedback.value = value;
        this.feedbackGain.gain.setTargetAtTime(value, now, smoothTime);
        break;

      case "mix":
        this.parameters.mix.value = value;
        // As the wet signal goes up, the dry signal goes down.
        const dryValue = 1.0 - value;
        const wetValue = value;
        this.dryGain.gain.setTargetAtTime(dryValue, now, smoothTime);
        this.wetGain.gain.setTargetAtTime(wetValue, now, smoothTime);
        break;
    }
  }

  /**
   * Disconnects all internal nodes for cleanup.
   */
  disconnect() {
    super.disconnect(); // Disconnects the main input
    this.delayNode.disconnect();
    this.feedbackGain.disconnect();
    this.wetGain.disconnect();
    this.dryGain.disconnect();
  }
}
