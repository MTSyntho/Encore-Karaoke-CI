import BasePlugin from "/libs/BasePlugin.js";

/**
 * Validates and gets the BiquadFilterType for a given string.
 * Defaults to 'peaking'.
 * @param {string} typeString - The type from the config.
 * @returns {BiquadFilterType}
 */
const getFilterType = (typeString) => {
  // --- MODIFIED: Added 'highpass' and 'lowpass' to the list of valid types. ---
  const validTypes = [
    "lowshelf",
    "highshelf",
    "peaking",
    "highpass",
    "lowpass",
  ];
  return validTypes.includes(typeString) ? typeString : "peaking";
};

/**
 * ParametricEQPlugin
 * A flexible multi-band parametric equalizer supporting multiple filter types.
 * The number and type of bands are configured dynamically.
 *
 * Audio Graph:
 * [input] -> [filter1] -> [filter2] -> ... -> [filterN] -> [output]
 */
export default class ParametricEQPlugin extends BasePlugin {
  constructor(audioContext) {
    super(audioContext);
    this.name = "Parametric EQ";

    this.filters = [];
    this.parameters = {};

    // Initially, just pass the signal through.
    this.input.connect(this.output);
  }

  /**
   * Builds the internal filter chain based on a configuration array.
   * @param {Array<object>} bandConfigs - Array of band configuration objects.
   */
  buildChain(bandConfigs) {
    // --- 1. Cleanup old chain ---
    this.input.disconnect();
    this.filters.forEach((f) => f.disconnect());
    this.filters = [];
    this.parameters = {};

    if (!bandConfigs || bandConfigs.length === 0) {
      this.input.connect(this.output);
      return;
    }

    // --- 2. Create new filters and parameters ---
    bandConfigs.forEach((bandConfig, index) => {
      const filter = this.audioContext.createBiquadFilter();
      const type = getFilterType(bandConfig.type);
      filter.type = type;

      // --- MODIFIED: More robust default frequency handling ---
      let defaultFreq = 1000;
      if (type === "lowshelf" || type === "highpass") defaultFreq = 100;
      if (type === "highshelf" || type === "lowpass") defaultFreq = 10000;

      const freq =
        bandConfig.freq !== undefined ? bandConfig.freq : defaultFreq;
      const gain = bandConfig.gain !== undefined ? bandConfig.gain : 0;
      const q = bandConfig.q !== undefined ? bandConfig.q : 1.0; // Q is used for resonance on HP/LP filters

      filter.frequency.value = freq;

      // --- MODIFIED: Apply Gain or Q based on filter type ---
      // Gain only applies to shelf and peaking filters.
      if (type === "peaking" || type === "lowshelf" || type === "highshelf") {
        filter.gain.value = gain;
      }
      // Q applies to peaking, highpass, and lowpass filters.
      if (type === "peaking" || type === "highpass" || type === "lowpass") {
        filter.Q.value = q;
      }

      this.filters.push(filter);

      // --- 3. Dynamically define the parameters for the UI ---
      const paramPrefix = `band${index}`;

      // Frequency is universal to all our filter types.
      this.parameters[`${paramPrefix}_freq`] = {
        type: "slider",
        min: 20,
        max: 20000,
        step: 1,
        unit: "Hz",
        value: freq,
        affectsChain: false,
      };

      // Conditionally add Gain parameter if the filter uses it.
      if (type === "peaking" || type === "lowshelf" || type === "highshelf") {
        this.parameters[`${paramPrefix}_gain`] = {
          type: "slider",
          min: -18,
          max: 18,
          step: 0.1,
          unit: "dB",
          value: gain,
          affectsChain: false,
        };
      }

      // Conditionally add Q parameter if the filter uses it.
      if (type === "peaking" || type === "highpass" || type === "lowpass") {
        this.parameters[`${paramPrefix}_q`] = {
          type: "slider",
          min: 0.1,
          max: 18,
          step: 0.1,
          unit: "Q",
          value: q,
          affectsChain: false,
        };
      }
    });

    // --- 4. Connect the new filter chain ---
    let lastNode = this.input;
    this.filters.forEach((filter) => {
      lastNode.connect(filter);
      lastNode = filter;
    });
    lastNode.connect(this.output);
  }

  /**
   * Sets a parameter value.
   */
  setParameter(key, value) {
    const now = this.audioContext.currentTime;
    const smoothTime = 0.02;

    if (key === "bands") {
      this.parameters.bands = value;
      this.buildChain(value);
      return;
    }

    if (this.parameters[key]) {
      this.parameters[key].value = value;
    }

    const parts = key.split("_");
    if (parts.length !== 2) return;

    const bandIndex = parseInt(parts[0].replace("band", ""), 10);
    const paramType = parts[1];
    const filter = this.filters[bandIndex];
    if (!filter) return;

    switch (paramType) {
      case "freq":
        filter.frequency.setTargetAtTime(value, now, smoothTime);
        break;
      case "gain":
        // Check if the gain property exists before setting it.
        if (filter.gain) {
          filter.gain.setTargetAtTime(value, now, smoothTime);
        }
        break;
      case "q":
        // Check if the Q property exists before setting it.
        if (filter.Q) {
          filter.Q.setTargetAtTime(value, now, smoothTime);
        }
        break;
    }
  }

  disconnect() {
    super.disconnect();
    this.filters.forEach((f) => f.disconnect());
  }
}
