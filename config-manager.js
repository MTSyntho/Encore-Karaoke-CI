const fs = require("fs");
const path = require("path");

// A minimal default state for a new installation or after a reset.
// The app's setup flow is responsible for populating the rest.
const DEFAULT_CONFIG = {
  setupComplete: false,
};

class ConfigManager {
  constructor() {
    this.configPath = null;
    this.data = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.isLoaded = false;
  }

  /**
   * Initializes the config manager with the application's user data path.
   * @param {string} userDataPath - The path provided by Electron's app.getPath("userData").
   */
  init(userDataPath) {
    // CRITICAL: Use a new filename to avoid overwriting the old config system.
    // This ensures full backwards compatibility.
    this.configPath = path.join(userDataPath, "encore-settings.json");
    this.load();
  }

  // --- Private Helpers for Dot Notation (No changes needed here) ---

  _getValueByPath(obj, path) {
    const keys = path.split(".");
    return keys.reduce(
      (acc, key) => (acc && acc[key] !== "undefined" ? acc[key] : undefined),
      obj,
    );
  }

  _setValueByPath(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const parent = keys.reduce((acc, key) => {
      if (typeof acc[key] === "undefined" || acc[key] === null) {
        acc[key] = {};
      }
      return acc[key];
    }, obj);
    parent[lastKey] = value;
  }

  /**
   * Loads the configuration from the file system. This method is designed to be
   * resilient and will never fail, falling back to safe defaults if the file
   * is missing or corrupted.
   */
  load() {
    // If the config file doesn't exist, we don't need to do anything.
    // The constructor has already loaded the safe, minimal default.
    if (!fs.existsSync(this.configPath)) {
      console.log(
        `[CONFIG] No settings file found at "${this.configPath}". Using default configuration.`,
      );
      this.isLoaded = true;
      return;
    }

    try {
      const fileData = fs.readFileSync(this.configPath, "utf8");

      // If the file is empty, also use defaults.
      if (!fileData.trim()) {
        console.warn(
          `[CONFIG] Settings file is empty. Using default configuration.`,
        );
        this.isLoaded = true;
        return;
      }

      const parsedData = JSON.parse(fileData);

      // Merge the loaded data on top of the defaults. This provides forward-compatibility:
      // if you add new keys to DEFAULT_CONFIG in a future update, users with old
      // config files will get the new keys without losing their existing settings.
      this.data = Object.assign(
        JSON.parse(JSON.stringify(DEFAULT_CONFIG)),
        parsedData,
      );
      console.log("[CONFIG] Successfully loaded settings from file.");
    } catch (error) {
      // If the file is corrupted or unreadable, we catch the error, log it,
      // and revert to the safe default state. This prevents the app from crashing.
      console.error(
        `[CONFIG] Error reading or parsing "${this.configPath}". Backing up corrupted file and using defaults.`,
        error,
      );

      // As a safety measure, let's back up the bad config file.
      fs.renameSync(
        this.configPath,
        `${this.configPath}.corrupted-${Date.now()}`,
      );

      this.data = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    }

    this.isLoaded = true;
  }

  /**
   * Saves the current in-memory configuration to the file system.
   */
  save() {
    if (!this.configPath) return;
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error(
        `[CONFIG] Failed to save settings to "${this.configPath}".`,
        error,
      );
    }
  }

  // --- Public API (localStorage-like) ---

  getItem(key) {
    return this._getValueByPath(this.data, key);
  }

  setItem(key, value) {
    this._setValueByPath(this.data, key, value);
    this.save();
  }

  merge(dataObject) {
    const deepMerge = (target, source) => {
      for (const key in source) {
        if (source[key] instanceof Object && key in target) {
          Object.assign(source[key], deepMerge(target[key], source[key]));
        }
      }
      Object.assign(target || {}, source);
      return target;
    };
    this.data = deepMerge(this.data, dataObject);
    this.save();
  }

  getAll() {
    return this.data;
  }
}

module.exports = new ConfigManager();
