import BasePlugin from "/libs/BasePlugin.js";

const BANDS = [60, 150, 400, 1000, 2400, 6000, 15000];

export default class EQ7BandPlugin extends BasePlugin {
  constructor(audioContext) {
    super(audioContext);
    this.name = "7-Band Graphic EQ";

    this.filters = BANDS.map((freq) => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = "peaking";
      filter.frequency.value = freq;
      filter.Q.value = 1.41;
      filter.gain.value = 0;
      return filter;
    });

    this.parameters = {};
    BANDS.forEach((freq) => {
      const paramName = `gain${freq}Hz`;
      this.parameters[paramName] = {
        type: "slider",
        min: -12,
        max: 12,
        step: 0.1,
        unit: "dB",
        value: 0,
      };
    });

    // Chain the filters together
    this.input.connect(this.filters[0]);
    for (let i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i + 1]);
    }
    this.filters[this.filters.length - 1].connect(this.output);
  }

  setParameter(key, value) {
    const index = BANDS.findIndex((freq) => `gain${freq}Hz` === key);
    if (index !== -1) {
      this.parameters[key].value = value;
      this.filters[index].gain.setTargetAtTime(
        value,
        this.audioContext.currentTime,
        0.01,
      );
    }
  }

  disconnect() {
    super.disconnect();
    this.filters.forEach((f) => f.disconnect());
  }
}
