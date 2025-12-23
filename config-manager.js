const fs = require("fs");
const path = require("path");

const DEFAULT_CONFIG = {
  setupComplete: false,
  libraryPath: "",
  audioConfig: {
    mix: {
      instrumental: {
        outputDevice: null,
        volume: 1,
      },
      scoring: {
        inputDevice: null,
      },
    },
  },
  // Placeholders for future modules
  remoteSettings: {
    allowGuest: true,
  },
};

class ConfigManager {
  constructor() {
    this.configPath = null;
    this.data = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.isLoaded = false;
  }

  init(userDataPath) {
    this.configPath = path.join(userDataPath, "karaoke-config.json");
    this.load();
  }

  // Helper to deep merge objects (prevents overwriting nested keys like audioConfig)
  _deepMerge(target, source) {
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], this._deepMerge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }

  load() {
    try {
      if (fs.existsSync(this.configPath)) {
        const fileData = fs.readFileSync(this.configPath, "utf8");
        const parsedData = JSON.parse(fileData);

        // Merge file data on top of defaults to ensure structure integrity
        this.data = this._deepMerge(
          JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
          parsedData,
        );
        this.isLoaded = true;
        return true;
      }
    } catch (error) {
      // If error, we keep defaults
      throw new Error(`Failed to load config: ${error.message}`);
    }
    return false;
  }

  save() {
    if (!this.configPath) return;
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      throw new Error(`Failed to save config: ${error.message}`);
    }
  }

  get() {
    return this.data;
  }

  update(newConfig) {
    this.data = newConfig;
    this.save();
  }
}

module.exports = new ConfigManager();
