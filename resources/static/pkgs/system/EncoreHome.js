import Html from "/libs/html.js";

let wrapper, Ui, Pid, FsSvc, Forte;

// We need to store event listeners so we can remove them later.
let keydownHandler = null;
let timeUpdateHandler = null;
let playbackUpdateHandler = null;
let lyricEventHandler = null;
let scoreUpdateHandler = null;
let lastPlaybackStatus = null;

let songList;

const config = await window.desktopIntegration.ipc.invoke("getConfig");

// --- MODIFIED: MixerUI Module is now clickable ---
const MixerUI = {
  isVisible: false,
  modal: null,
  listPanel: null,
  controlsPanel: null,
  state: {}, // To hold the data from Forte

  // Navigation state
  activePanel: "list", // 'list' or 'controls'
  selectedIndex: 0,
  selectedParamIndex: 0,

  init(container) {
    this.modal = new Html("div").classOn("mixer-modal").appendTo(container);
    const content = new Html("div")
      .classOn("mixer-content")
      .appendTo(this.modal);

    const header = new Html("div").classOn("mixer-header").appendTo(content);
    new Html("h1").text("MIC / MUSIC SETUP").appendTo(header);
    new Html("p")
      .text(
        "Use Arrow Keys to navigate, [Tab] to switch panels, [ESC] to close.",
      )
      .appendTo(header);

    const main = new Html("div").classOn("mixer-main").appendTo(content);
    this.listPanel = new Html("div").classOn("mixer-list-panel").appendTo(main);
    this.controlsPanel = new Html("div")
      .classOn("mixer-controls-panel")
      .appendTo(main);

    // --- NEW: Allow closing modal by clicking background ---
    this.modal.on("click", (e) => {
      if (e.target === this.modal.elm) {
        this.toggle();
      }
    });

    console.log("[MixerUI] Initialized.");
  },

  toggle() {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      this.build();
      this.modal.classOn("visible");
      this.activePanel = "list";
      this.selectedIndex = 0;
      this.selectedParamIndex = 0;
      this._updateListHighlight();
      this._renderControls();
    } else {
      this.modal.classOff("visible");
    }
  },

  build() {
    this.state = Forte.getVocalChainState();
    this.listPanel.clear();

    const items = [
      "Mic Record Volume",
      "Music Record Volume",
      ...this.state.chain.map((p) => p.name),
    ];

    items.forEach((name, index) => {
      new Html("div")
        .classOn("mixer-item")
        .text(name)
        .on("click", () => {
          this.selectedIndex = index;
          this.selectedParamIndex = 0; // Reset param index when changing item
          this.activePanel = "list"; // Focus should return to the list
          this._updateListHighlight();
          this._renderControls();
        })
        .appendTo(this.listPanel);
    });
  },

  _renderControls() {
    this.controlsPanel.clear();
    const items = this.listPanel.qsa(".mixer-item");
    if (!items || !items[this.selectedIndex]) return;

    const title = items[this.selectedIndex].getText();
    new Html("h2")
      .classOn("mixer-controls-title")
      .text(title)
      .appendTo(this.controlsPanel);

    const controlsContainer = new Html("div")
      .classOn("mixer-controls-container")
      .appendTo(this.controlsPanel);

    // Case 1: Mic Record Volume
    if (this.selectedIndex === 0) {
      this._createSlider(
        controlsContainer,
        "Gain",
        {
          type: "slider",
          min: 0,
          max: 2,
          step: 0.01,
          unit: "x",
          value: this.state.micGain,
        },
        (value) => {
          Forte.setMicRecordingVolume(value);
          this.state.micGain = value; // Update local state for immediate feedback
        },
        0,
      );
    }
    // Case 2: Music Record Volume
    else if (this.selectedIndex === 1) {
      this._createSlider(
        controlsContainer,
        "Level",
        {
          type: "slider",
          min: 0,
          max: 1,
          step: 0.01,
          unit: "%",
          value: this.state.musicGain,
        },
        (value) => {
          Forte.setMusicRecordingVolume(value);
          this.state.musicGain = value; // Update local state
        },
        0,
      );
    }
    // Case 3: A Plugin
    else {
      const pluginIndex = this.selectedIndex - 2;
      const plugin = this.state.chain[pluginIndex];
      if (plugin && plugin.parameters) {
        Object.entries(plugin.parameters).forEach(
          ([paramName, paramDef], pIndex) => {
            // Skip the special 'bands' parameter for ParametricEQ
            if (paramName === "bands") return;

            this._createSlider(
              controlsContainer,
              paramName.replace(/_/g, " "),
              paramDef,
              (value) => {
                Forte.setPluginParameter(pluginIndex, paramName, value);
              },
              pIndex,
            );
          },
        );
      }
    }
    this._updateControlsHighlight();
  },

  _createSlider(container, name, paramDef, callback, paramIndex) {
    const controlEl = new Html("div")
      .classOn("mixer-control")
      .attr({ "data-param-index": paramIndex })
      .on("click", () => {
        this.activePanel = "controls";
        this.selectedParamIndex = paramIndex;
        this._updateListHighlight();
        this._updateControlsHighlight();
      })
      .appendTo(container);

    const label = new Html("label").text(name).appendTo(controlEl);
    const sliderWrapper = new Html("div")
      .classOn("mixer-slider-wrapper")
      .appendTo(controlEl);
    const slider = new Html("input")
      .attr({
        type: "range",
        min: paramDef.min,
        max: paramDef.max,
        step: paramDef.step,
        value: paramDef.value,
      })
      .appendTo(sliderWrapper);
    const valueDisplay = new Html("span")
      .classOn("mixer-value-display")
      .appendTo(controlEl);

    const updateDisplay = (val) => {
      let displayValue;
      if (paramDef.unit === "%") {
        displayValue = `${(val * 100).toFixed(0)}%`;
      } else if (
        paramDef.unit === "dB" ||
        paramDef.unit === ":1" ||
        paramDef.unit === "Q"
      ) {
        displayValue = `${parseFloat(val).toFixed(1)} ${paramDef.unit}`;
      } else if (paramDef.unit === "ms" || paramDef.unit === "Hz") {
        displayValue = `${Math.round(val)} ${paramDef.unit}`;
      } else {
        displayValue = `${parseFloat(val).toFixed(2)} ${paramDef.unit || ""}`;
      }
      valueDisplay.text(displayValue.trim());
    };

    slider.on("input", (e) => {
      const newValue = parseFloat(e.target.value);
      callback(newValue);
      updateDisplay(newValue);
    });

    updateDisplay(paramDef.value); // Set initial value
  },

  _updateListHighlight() {
    this.listPanel.qsa(".mixer-item").forEach((item, index) => {
      if (this.activePanel === "list" && index === this.selectedIndex) {
        item.classOn("mixer-item--active");
        item.elm.scrollIntoView({ block: "nearest" });
      } else {
        item.classOff("mixer-item--active");
      }
    });
  },

  _updateControlsHighlight() {
    this.controlsPanel.qsa(".mixer-control").forEach((control, index) => {
      if (
        this.activePanel === "controls" &&
        index === this.selectedParamIndex
      ) {
        control.classOn("mixer-control--active");
        control.elm.scrollIntoView({ block: "nearest" });
      } else {
        control.classOff("mixer-control--active");
      }
    });
  },

  handleKeyDown(e) {
    e.preventDefault();
    const numListItems = this.listPanel.qsa(".mixer-item").length;
    const numParamItems = this.controlsPanel.qsa(".mixer-control").length;

    switch (e.key) {
      case "ArrowUp":
        if (this.activePanel === "list") {
          this.selectedIndex = Math.max(0, this.selectedIndex - 1);
          this.selectedParamIndex = 0;
          this._updateListHighlight();
          this._renderControls();
        } else {
          // 'controls'
          this.selectedParamIndex = Math.max(0, this.selectedParamIndex - 1);
          this._updateControlsHighlight();
        }
        break;

      case "ArrowDown":
        if (this.activePanel === "list") {
          this.selectedIndex = Math.min(
            numListItems - 1,
            this.selectedIndex + 1,
          );
          this.selectedParamIndex = 0;
          this._updateListHighlight();
          this._renderControls();
        } else {
          // 'controls'
          this.selectedParamIndex = Math.min(
            numParamItems - 1,
            this.selectedParamIndex + 1,
          );
          this._updateControlsHighlight();
        }
        break;

      case "ArrowRight":
        if (this.activePanel === "list" && numParamItems > 0) {
          this.activePanel = "controls";
          this._updateListHighlight();
          this._updateControlsHighlight();
        } else if (this.activePanel === "controls") {
          const activeControl = this.controlsPanel.qs(
            `.mixer-control[data-param-index="${this.selectedParamIndex}"]`,
          );
          const slider = activeControl?.qs('input[type="range"]');
          if (slider) {
            slider.elm.stepUp();
            slider.elm.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
        break;

      case "ArrowLeft":
        if (this.activePanel === "controls") {
          const activeControl = this.controlsPanel.qs(
            `.mixer-control[data-param-index="${this.selectedParamIndex}"]`,
          );
          const slider = activeControl?.qs('input[type="range"]');
          if (slider) {
            slider.elm.stepDown();
            slider.elm.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }
        break;

      case "Tab": // Use Tab to switch panels
        if (this.activePanel === "list" && numParamItems > 0) {
          this.activePanel = "controls";
        } else {
          this.activePanel = "list";
        }
        this._updateListHighlight();
        this._updateControlsHighlight();
        break;

      case "Escape":
        this.toggle();
        break;
    }
  },
};

// --- Recorder Module ---
const Recorder = {
  isRecording: false,
  mediaRecorder: null,
  recordedChunks: [],
  canvas: null,
  ctx: null,
  animationFrameId: null,
  forteSvc: null,
  bgvPlayer: null,
  currentSongInfo: null, // To store song title and artist
  uiRefs: {
    playerUi: null,
    lrcLineDisplay1: null,
    lrcLineDisplay2: null,
    progressBar: null,
    scoreDisplay: null,
  },
  outputResolution: { width: 1920, height: 1080 },

  init(container, forteSvc, bgvPlayer, uiRefs) {
    this.forteSvc = forteSvc;
    this.bgvPlayer = bgvPlayer;
    this.uiRefs = uiRefs;

    this.canvas = new Html("canvas")
      .attr({
        width: this.outputResolution.width,
        height: this.outputResolution.height,
      })
      .styleJs({ display: "none" })
      .appendTo(container).elm;

    this.ctx = this.canvas.getContext("2d");
    console.log("[Recorder] Initialized successfully.");
  },

  setSongInfo(song) {
    if (song) {
      this.currentSongInfo = { title: song.title, artist: song.artist };
    }
  },

  clearSongInfo() {
    this.currentSongInfo = null;
  },

  toggle() {
    if (this.isRecording) {
      this.stop();
    } else {
      this.start();
    }
  },

  start() {
    if (this.isRecording || !this.forteSvc || !this.bgvPlayer) return;

    const audioStream = this.forteSvc.getRecordingAudioStream();
    if (!audioStream || audioStream.getAudioTracks().length === 0) {
      console.error(
        "[Recorder] Could not get a valid audio stream from Forte.",
      );
      InfoBar.showTemp("RECORDING", "Error: No audio stream found.", 4000);
      return;
    }

    const videoStream = this.canvas.captureStream(30);
    const combinedStream = new MediaStream([
      videoStream.getVideoTracks()[0],
      audioStream.getAudioTracks()[0],
    ]);

    this.recordedChunks = [];
    try {
      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm; codecs=vp9,opus",
        videoBitsPerSecond: 5000000,
      });
    } catch (e) {
      console.error("Failed to create MediaRecorder:", e);
      InfoBar.showTemp("RECORDING", "Error: Could not start recorder.", 4000);
      return;
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = `Encore-Recording-${new Date()
        .toISOString()
        .replace(/:/g, "-")}.webm`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      InfoBar.showTemp(
        "RECORDING",
        "Recording saved to Downloads folder.",
        5000,
      );
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.drawFrame();
    InfoBar.showDefault();
    console.log("[Recorder] Recording started.");
  },

  stop() {
    if (!this.isRecording || !this.mediaRecorder) return;
    this.mediaRecorder.stop();
    this.isRecording = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    InfoBar.showDefault();
    console.log("[Recorder] Recording stopped.");
  },

  drawFrame() {
    if (!this.isRecording) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.ctx.clearRect(0, 0, w, h);

    // --- 1. Draw Video Background ---
    let sourceVideo = null;
    if (this.bgvPlayer.isManualMode) {
      sourceVideo = this.bgvPlayer.activeManualPlayer;
    } else {
      sourceVideo =
        this.bgvPlayer.videoElements[this.bgvPlayer.activePlayerIndex];
    }
    if (sourceVideo && sourceVideo.readyState >= 2 && !sourceVideo.paused) {
      this.ctx.drawImage(sourceVideo, 0, 0, w, h);
    } else {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, w, h);
    }

    // --- 2. Draw UI Overlays ---
    if (!this.uiRefs.playerUi.elm.classList.contains("hidden")) {
      const gradient = this.ctx.createLinearGradient(0, h * 0.5, 0, h);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.9)");
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, h * 0.5, w, h * 0.5);

      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "bottom";

      // Base positions for lyrics
      const line1BaseY = h - 180;
      const line2BaseY = h - 90;

      // Check if each line has romanized text
      const line1HasRomanized = this.uiRefs.lrcLineDisplay1.elm.querySelector(
        ".lyric-line-romanized",
      )?.textContent;
      const line2HasRomanized = this.uiRefs.lrcLineDisplay2.elm.querySelector(
        ".lyric-line-romanized",
      )?.textContent;

      // Calculate Y positions with smarter overlap prevention
      const line1Y = line1HasRomanized
        ? line2HasRomanized
          ? line1BaseY - 40
          : line1BaseY - 20 // Push up more if both lines have romanized
        : line1BaseY;
      const line2Y = line2HasRomanized ? line2BaseY - 20 : line2BaseY;

      this.drawLyricLine(this.uiRefs.lrcLineDisplay1.elm, line1Y);
      this.drawLyricLine(this.uiRefs.lrcLineDisplay2.elm, line2Y);

      const progressWidth = parseFloat(
        this.uiRefs.progressBar.elm.style.width || "0%",
      );
      const barY = h - 60;
      const barH = 10;
      const barW = w * 0.8;
      const barX = (w - barW) / 2;
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      this.ctx.fillRect(barX, barY, barW, barH);
      this.ctx.fillStyle = "#89CFF0";
      this.ctx.fillRect(barX, barY, barW * (progressWidth / 100), barH);

      if (
        this.uiRefs.scoreDisplay.elm.parentElement.classList.contains("visible")
      ) {
        this.ctx.font = "bold 2.5rem Rajdhani, sans-serif";
        this.ctx.fillStyle = "#89CFF0";
        this.ctx.textAlign = "right";
        this.ctx.fillText(this.uiRefs.scoreDisplay.getText(), w - 50, h - 80);
        this.ctx.font = "bold 1rem Rajdhani, sans-serif";
        this.ctx.fillStyle = "#FFD700";
        this.ctx.fillText("SCORE", w - 50 - 100, h - 85);
      }
    }

    // --- Draw Song Info Overlay ---
    if (this.currentSongInfo) {
      const x = 50;
      const y = 50;
      const maxWidth = w * 0.4;
      const padding = 25;

      this.ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      this.ctx.beginPath();
      this.ctx.roundRect(
        x - padding,
        y - padding,
        maxWidth + padding * 2,
        120 + padding,
        15,
      );
      this.ctx.fill();

      this.ctx.font = "bold 48px Rajdhani, sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
      this.ctx.shadowColor = "black";
      this.ctx.shadowBlur = 5;
      this.ctx.fillText(this.currentSongInfo.title, x, y, maxWidth);

      this.ctx.font = "32px Rajdhani, sans-serif";
      this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      this.ctx.fillText(this.currentSongInfo.artist, x, y + 65, maxWidth);

      this.ctx.shadowBlur = 0;
    }

    this.animationFrameId = requestAnimationFrame(() => this.drawFrame());
  },

  drawLyricLine(element, y) {
    const originalEl = element.querySelector(".lyric-line-original");
    const romanizedEl = element.querySelector(".lyric-line-romanized");

    if (!originalEl || !originalEl.textContent) return;

    const isActive = element.classList.contains("active");
    const defaultOpacity = element.classList.contains("next") ? 0.5 : 0.4;

    this.ctx.font = "bold 4.5rem Rajdhani, sans-serif";
    this.ctx.fillStyle = isActive
      ? "#FFFFFF"
      : `rgba(255, 255, 255, ${defaultOpacity})`;
    if (isActive) {
      this.ctx.strokeStyle = "#010141";
      this.ctx.lineWidth = 12;
      this.ctx.lineJoin = "round";
      this.ctx.strokeText(originalEl.textContent, this.canvas.width / 2, y);
    }
    this.ctx.fillText(originalEl.textContent, this.canvas.width / 2, y);

    if (romanizedEl && romanizedEl.textContent) {
      this.ctx.font = "500 1.5rem Rajdhani, sans-serif";
      this.ctx.fillStyle = isActive
        ? "#FFFFFF"
        : `rgba(255, 255, 255, ${defaultOpacity + 0.1})`;
      this.ctx.fillText(romanizedEl.textContent, this.canvas.width / 2, y + 40);
    }
  },
};

// --- BGVPlayer Module ---
const BGVPlayer = {
  videoElements: [],
  playlist: [],
  currentIndex: 0,
  activePlayerIndex: 0,
  bgvContainer: null,
  FADE_DURATION: 1200,
  PRELOAD_DELAY: 500,
  categories: [],
  selectedCategory: "Auto",
  isManualMode: false,
  activeManualPlayer: null,
  async init(container) {
    this.bgvContainer = container;
    for (let i = 0; i < 2; i++) {
      const videoEl = new Html("video")
        .attr({
          muted: true,
          autoplay: false,
          playsInline: true,
          defaultMuted: true,
        })
        .styleJs({
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: i === 0 ? "1" : "0",
          transform: "scale(1.01)",
          transition: `opacity ${this.FADE_DURATION}ms ease-in-out`,
          willChange: "opacity",
        })
        .appendTo(this.bgvContainer);
      const elm = videoEl.elm;
      elm.volume = 0;
      elm.addEventListener("volumechange", () => (elm.volume = 0));
      this.videoElements.push(elm);
    }
  },
  async loadManifestCategories() {
    const manifestUrl = "http://127.0.0.1:9864/assets/video/bgv/manifest.json";
    try {
      const response = await fetch(manifestUrl);
      this.categories = await response.json();
    } catch (error) {
      console.error("[BGV] Failed to load video manifest:", error);
      this.bgvContainer.text("Could not load background videos.");
      this.categories = [];
    }
  },
  addDynamicCategory(category) {
    if (category && category.BGV_LIST && category.BGV_LIST.length > 0) {
      this.categories.push(category);
    }
  },
  async updatePlaylistForCategory() {
    const assetBaseUrl = "http://127.0.0.1:9864/assets/video/bgv/";
    this.playlist = [];
    let allVideos = [];
    if (this.selectedCategory === "Auto") {
      for (const cat of this.categories) {
        if (cat.isAbsolute) {
          const urls = cat.BGV_LIST.map((videoPath) => {
            const url = new URL("http://127.0.0.1:9864/getFile");
            url.searchParams.append("path", videoPath);
            return url.href;
          });
          allVideos.push(...urls);
        } else {
          const urls = cat.BGV_LIST.map(
            (videoPath) => assetBaseUrl + videoPath,
          );
          allVideos.push(...urls);
        }
      }
    } else {
      const category = this.categories.find(
        (c) => c.BGV_CATEGORY === this.selectedCategory,
      );
      if (category) {
        if (category.isAbsolute) {
          allVideos = category.BGV_LIST.map((videoPath) => {
            const url = new URL("http://127.0.0.1:9864/getFile");
            url.searchParams.append("path", videoPath);
            return url.href;
          });
        } else {
          allVideos = category.BGV_LIST.map(
            (videoPath) => assetBaseUrl + videoPath,
          );
        }
      }
    }
    this.playlist = allVideos;
    for (let i = this.playlist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playlist[i], this.playlist[j]] = [
        this.playlist[j],
        this.playlist[i],
      ];
    }
    console.log(
      `[BGV] Loaded ${this.playlist.length} videos for category: ${this.selectedCategory}`,
    );
    await this.cleanStop();
    this.currentIndex = 0;
    this.start();
  },
  async cleanStop() {
    this.videoElements.forEach((vid) => {
      vid.onended = null;
      vid.pause();
    });
    await new Promise((resolve) => setTimeout(resolve, this.FADE_DURATION));
    this.videoElements.forEach((vid) => {
      vid.removeAttribute("src");
      vid.load();
      vid.style.opacity =
        vid === this.videoElements[this.activePlayerIndex] ? "1" : "0";
    });
  },
  cycleCategory(direction) {
    if (this.isManualMode) return;
    const allCategoryNames = [
      "Auto",
      ...this.categories.map((c) => c.BGV_CATEGORY),
    ];
    let currentIndex = allCategoryNames.indexOf(this.selectedCategory);
    currentIndex =
      (currentIndex + direction + allCategoryNames.length) %
      allCategoryNames.length;
    this.selectedCategory = allCategoryNames[currentIndex];
    this.updatePlaylistForCategory();
  },
  start() {
    if (this.isManualMode || this.playlist.length === 0) return;
    const activePlayer = this.videoElements[this.activePlayerIndex];
    const preloadPlayer = this.videoElements[1 - this.activePlayerIndex];
    activePlayer.loop = false;
    preloadPlayer.loop = false;
    activePlayer.src = this.playlist[this.currentIndex];
    activePlayer.play().catch(console.error);
    activePlayer.onended = () => this.playNext();
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    setTimeout(() => {
      if (this.isManualMode) return;
      preloadPlayer.src = this.playlist[this.currentIndex];
      preloadPlayer.load();
    }, this.PRELOAD_DELAY);
  },
  playNext() {
    if (this.isManualMode) return;
    const currentPlayer = this.videoElements[this.activePlayerIndex];
    const nextPlayer = this.videoElements[1 - this.activePlayerIndex];
    nextPlayer.play().catch(console.error);
    setTimeout(() => {
      currentPlayer.style.opacity = "0";
      nextPlayer.style.opacity = "1";
    }, 50);
    this.activePlayerIndex = 1 - this.activePlayerIndex;
    nextPlayer.onended = () => this.playNext();
    setTimeout(() => {
      if (this.isManualMode) return;
      this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
      currentPlayer.src = this.playlist[this.currentIndex];
      currentPlayer.load();
    }, this.FADE_DURATION + this.PRELOAD_DELAY);
  },
  async playSingleVideo(url) {
    this.isManualMode = true;
    await this.cleanStop();
    const activePlayer = this.videoElements[this.activePlayerIndex];
    activePlayer.src = url;
    activePlayer.load();
    activePlayer.style.opacity = "1";
    this.activeManualPlayer = activePlayer;
    return activePlayer;
  },
  async resumePlaylist() {
    if (!this.isManualMode) return;
    this.isManualMode = false;
    this.activeManualPlayer = null;
    await this.updatePlaylistForCategory();
  },
  stop() {
    this.cleanStop().catch(console.error);
  },
};

// --- Romanizer Module ---
const Romanizer = {
  getPlaceholder(text, placeholderChar) {
    return text.replace(/\S/g, placeholderChar);
  },
  async romanize(text) {
    if (!text || !text.trim()) return null;
    if (/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(text)) {
      try {
        const params = new URLSearchParams({ t: text });
        const url = `http://127.0.0.1:9864/romanize?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          console.error(
            `[Romanizer] Failed to fetch romanization for: ${text}`,
          );
          return null;
        }
        return await res.text();
      } catch (err) {
        console.error(`[Romanizer] Network error during romanization:`, err);
        return null;
      }
    }
    if (/[\uac00-\ud7af]/.test(text)) {
      return Aromanize.romanize(text);
    }
    return null;
  },
};

// --- InfoBar Module ---
const InfoBar = {
  bar: null,
  labelEl: null,
  contentEl: null,
  timeout: null,
  isTempVisible: false,
  persistentState: { label: "", content: "" },

  init(container) {
    this.bar = new Html("div").classOn("info-bar").appendTo(container);
    this.labelEl = new Html("div").classOn("info-bar-label").appendTo(this.bar);
    this.contentEl = new Html("div")
      .classOn("info-bar-content")
      .appendTo(this.bar);
  },

  show(label, content) {
    this.persistentState = { label, content };
    if (!this.isTempVisible) {
      this.labelEl.text(label);
      this.contentEl.html(content);
    }
  },

  showTemp(label, content, duration) {
    if (this.timeout) clearTimeout(this.timeout);
    this.isTempVisible = true;
    this.labelEl.text(label);
    this.contentEl.html(content);
    this.bar.classOn("temp-visible");
    this.timeout = setTimeout(() => {
      this.isTempVisible = false;
      this.timeout = null;
      this.labelEl.text(this.persistentState.label);
      this.contentEl.html(this.persistentState.content);
      this.bar.classOff("temp-visible");
    }, duration);
  },

  showBar() {
    this.bar.classOn("persist-visible");
  },
  hideBar() {
    this.bar.classOff("persist-visible");
  },

  showDefault() {
    if (Recorder.isRecording) {
      this.show("RECORDING", "REC ●");
      return;
    }
    const { reservationQueue } = this.context();
    if (reservationQueue.length > 0) {
      const nextSong = reservationQueue[0];
      const extra =
        reservationQueue.length > 1 ? ` (+${reservationQueue.length - 1})` : "";
      const codeSpan = nextSong.code
        ? `<span class="info-bar-code">${nextSong.code}</span>`
        : `<span class="info-bar-code is-youtube">YT</span>`;
      const content = `${codeSpan} <span class="info-bar-title">${nextSong.title}</span> <span class="info-bar-artist">- ${nextSong.artist}${extra}</span>`;
      this.show("UP NEXT", content);
    } else {
      this.show("UP NEXT", "—");
    }
  },

  showReservation(reservationNumber) {
    const { songMap } = this.context();
    const displayCode = reservationNumber.padStart(5, "0");
    const song = songMap.get(displayCode);
    let songInfo = "";
    if (song) {
      songInfo = `<span class="info-bar-title">${song.title}</span><span class="info-bar-artist">- ${song.artist}</span>`;
    } else if (reservationNumber.length === 5) {
      songInfo = `<span style="opacity: 0.5;">No song found.</span>`;
    }
    const content = `<span class="info-bar-code">${displayCode}</span> ${songInfo}`;
    this.showTemp("RESERVING", content, 3000);
  },

  context() {
    return { reservationQueue: [], songMap: new Map() };
  },
};

// --- ScoreHUD Module ---
const ScoreHUD = {
  hud: null,
  scoreDisplay: null,
  init(container) {
    this.hud = new Html("div").classOn("score-hud").appendTo(container);
    new Html("div").classOn("score-hud-label").text("SCORE").appendTo(this.hud);
    this.scoreDisplay = new Html("div")
      .classOn("score-hud-value")
      .appendTo(this.hud);
    this.hide();
  },
  show(score) {
    this.scoreDisplay.text(Math.floor(score));
    this.hud.classOn("visible");
  },
  hide() {
    this.hud.classOff("visible");
  },
};

const pkg = {
  name: "Encore Home",
  type: "app",
  privs: 0,
  start: async function (Root) {
    Pid = Root.Pid;
    Ui = Root.Processes.getService("UiLib").data;
    FsSvc = Root.Processes.getService("FsSvc").data;
    Forte = Root.Processes.getService("ForteSvc").data;

    wrapper = new Html("div").classOn("full-ui").appendTo("body");
    Ui.becomeTopUi(Pid, wrapper);

    console.log("[Encore] Preloading UI sound effects...");
    const sfxToLoad = ["fanfare.mp3", "fanfare-2.mp3"];
    for (let i = 0; i < 10; i++) {
      sfxToLoad.push(`numbers/${i}.wav`);
    }
    await Promise.all(
      sfxToLoad.map((sfx) => Forte.loadSfx(`/assets/audio/${sfx}`)),
    );
    console.log("[Encore] All UI sound effects preloaded.");

    const socket = io({ query: { clientType: "app" } });
    socket.on("connect", () => console.log("[LINK] Connected to server."));

    console.log("[Encore] Loading default vocal chain...");
    try {
      const response = await fetch("/pkgs/chains/defaultVocalChain.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const defaultChain = await response.json();
      await Forte.loadVocalChain(defaultChain);
      console.log("[Encore] Default vocal chain loaded successfully.");
    } catch (e) {
      console.error("[Encore] Could not load default vocal chain.", e);
      InfoBar.showTemp("ERROR", "Could not load vocal chain.", 5000);
    }

    songList = FsSvc.getSongList();
    const songMap = new Map(songList.map((song) => [song.code, song]));
    let songItemElements = [];
    const maxLength = 5;
    let state = {
      mode: "menu",
      songNumber: "",
      highlightedIndex: -1,
      reservationNumber: "",
      reservationQueue: [],
      volume: config.audioConfig.mix.instrumental.volume,
      videoSyncOffset: config.videoConfig?.syncOffset || 0,
      searchResults: [],
      highlightedSearchIndex: -1,
      isSearching: false,
      isSearchOverlayVisible: false,
      currentSongIsYouTube: false,
      currentSongIsMultiplexed: false,
      currentSongIsMV: false,
      isTransitioning: false,
      isTypingNumber: false,
    };

    InfoBar.context = () => ({
      reservationQueue: state.reservationQueue,
      songMap: songMap,
    });

    window.desktopIntegration.ipc.send("setRPC", {
      details: `Browsing ${songList.length} Songs...`,
      state: `Main Menu`,
    });

    await Forte.setTrackVolume(config.audioConfig.mix.instrumental.volume);
    if (config.audioConfig.micLatency) {
      await Forte.setLatency(config.audioConfig.micLatency);
    }
    if (config.audioConfig.mix.scoring.inputDevice) {
      await Forte.setMicDevice(config.audioConfig.mix.scoring.inputDevice);
    }

    const bgvContainer = new Html("div")
      .classOn("bgv-container")
      .appendTo(wrapper);
    const youtubePlayerContainer = new Html("div")
      .classOn("youtube-player-container", "hidden")
      .appendTo(wrapper);
    const youtubeIframe = new Html("iframe").appendTo(youtubePlayerContainer);

    const overlay = new Html("div").classOn("overlay-ui").appendTo(wrapper);
    const searchUi = new Html("div").classOn("search-ui").appendTo(wrapper);
    const playerUi = new Html("div")
      .classOn("player-ui", "hidden")
      .appendTo(wrapper);

    const postSongScoreScreen = new Html("div")
      .classOn("post-song-score-screen")
      .appendTo(wrapper);
    const scoreCard = new Html("div")
      .classOn("score-card")
      .appendTo(postSongScoreScreen);
    const scoreHeader = new Html("div")
      .classOn("score-header")
      .appendTo(scoreCard);
    new Html("div")
      .classOn("score-header-title")
      .text("YOUR SCORE")
      .appendTo(scoreHeader);
    new Html("div")
      .classOn("score-header-subtitle")
      .text("ADVANCED SCORING")
      .appendTo(scoreHeader);
    const scoreMain = new Html("div").classOn("score-main").appendTo(scoreCard);
    const finalScoreContainer = new Html("div")
      .classOn("final-score-container")
      .appendTo(scoreMain);
    new Html("div")
      .classOn("final-score-label")
      .text("YOUR SCORE")
      .appendTo(finalScoreContainer);
    const finalScoreDisplay = new Html("div")
      .classOn("final-score")
      .appendTo(finalScoreContainer);
    const scoreDetails = new Html("div")
      .classOn("score-details")
      .appendTo(scoreCard);
    const createGauge = (label, className) => {
      const container = new Html("div")
        .classOn("score-gauge-container")
        .appendTo(scoreDetails);
      new Html("span")
        .classOn("score-gauge-label")
        .text(label)
        .appendTo(container);
      const gauge = new Html("div")
        .classOn("score-gauge", className)
        .appendTo(container);
      const valueDisplay = new Html("span")
        .classOn("score-gauge-value")
        .appendTo(gauge);
      return { gauge, valueDisplay };
    };
    const keyRhythmGauge = createGauge("Key/Rhythm", "gauge-key-rhythm");
    const vibratoGauge = createGauge("Vibrato", "gauge-vibrato");
    const upbandGauge = createGauge("Upband", "gauge-upband");
    const downbandGauge = createGauge("Downband", "gauge-downband");

    InfoBar.init(wrapper);
    ScoreHUD.init(wrapper);

    MixerUI.init(wrapper);

    const calibrationScreen = new Html("div")
      .classOn("calibration-screen")
      .appendTo(wrapper);
    const calibrationTitle = new Html("h1").appendTo(calibrationScreen);
    const calibrationText = new Html("p").appendTo(calibrationScreen);

    wrapper.classOn("loading");

    const mainContent = new Html("div")
      .classOn("main-content")
      .appendTo(overlay);
    new Html("h1").text("Enter Song Number").appendTo(mainContent);
    const numberDisplay = new Html("div")
      .classOn("number-display")
      .appendTo(mainContent);
    const songInfo = new Html("div").classOn("song-info").appendTo(mainContent);
    const songTitle = new Html("h2").classOn("song-title").appendTo(songInfo);
    const songArtist = new Html("p").classOn("song-artist").appendTo(songInfo);

    const songListContainer = new Html("div")
      .classOn("song-list-container")
      .appendTo(overlay);

    const listHeader = new Html("div")
      .classOn("song-list-header")
      .appendTo(songListContainer);
    new Html("div")
      .classOn("song-header-code")
      .text("CODE")
      .appendTo(listHeader);
    new Html("div")
      .classOn("song-header-title")
      .text("TITLE")
      .appendTo(listHeader);
    new Html("div")
      .classOn("song-header-artist")
      .text("ARTIST")
      .appendTo(listHeader);

    songList.forEach((song, index) => {
      const item = new Html("div")
        .classOn("song-item")
        .appendTo(songListContainer);
      new Html("div").classOn("song-item-code").text(song.code).appendTo(item);
      new Html("div")
        .classOn("song-item-title")
        .text(song.title)
        .appendTo(item);
      new Html("div")
        .classOn("song-item-artist")
        .text(song.artist)
        .appendTo(item);

      item.on("click", () => {
        startPlayer(song);
      });
      item.on("mouseover", () => {
        if (state.mode !== "menu" || state.isTypingNumber) return;
        state.highlightedIndex = index;
        updateMenuUI();
      });

      songItemElements.push(item);
    });

    const bottomActions = new Html("div")
      .classOn("bottom-actions")
      .appendTo(overlay);
    new Html("div")
      .classOn("action-button")
      .text("Search (Y)")
      .on("click", () => setMode("yt-search"))
      .appendTo(bottomActions);
    new Html("div")
      .classOn("action-button")
      .text("Calibrate Audio (C)")
      .on("click", runCalibrationSequence)
      .appendTo(bottomActions);
    new Html("div")
      .classOn("action-button")
      .text("Mic/Music Setup (M)")
      .on("click", () => MixerUI.toggle())
      .appendTo(bottomActions);

    const qrContainer = new Html("div")
      .classOn("qr-code-container")
      .appendTo(wrapper);
    const qrImg = new Html("img").appendTo(qrContainer);
    new Html("p").text("Use your phone as a remote!").appendTo(qrContainer);

    try {
      const response = await fetch("http://127.0.0.1:9864/local_ip");
      const local_ip = await response.text();
      const remoteUrl = `http://${local_ip}:9864/remote`;
      qrImg.attr({
        src: `http://127.0.0.1:9864/qr?url=${encodeURIComponent(remoteUrl)}`,
      });
    } catch (e) {
      console.error("Could not fetch local IP for QR code", e);
      qrContainer.classOn("hidden");
    }

    const searchWindow = new Html("div")
      .classOn("search-window")
      .appendTo(searchUi);
    const searchInput = new Html("input")
      .classOn("search-input")
      .attr({
        type: "text",
        placeholder: "Type here to search...",
      })
      .appendTo(searchWindow);
    const searchResultsContainer = new Html("div")
      .classOn("search-results-container")
      .appendTo(searchWindow);

    const introCard = new Html("div").classOn("intro-card").appendTo(playerUi);
    const introCardTitle = new Html("div")
      .classOn("intro-card-title")
      .appendTo(introCard);
    const introCardArtist = new Html("div")
      .classOn("intro-card-artist")
      .appendTo(introCard);

    const bottomSection = new Html("div")
      .classOn("player-bottom-section")
      .appendTo(playerUi);
    const countdownDisplay = new Html("div")
      .classOn("countdown-display")
      .appendTo(bottomSection);
    const lrcLyricsContainer = new Html("div")
      .classOn("lyrics-container")
      .appendTo(bottomSection);
    const lrcLineDisplay1 = new Html("div")
      .classOn("lyric-line")
      .appendTo(lrcLyricsContainer);
    const lrcLineDisplay2 = new Html("div")
      .classOn("lyric-line", "next")
      .appendTo(lrcLyricsContainer);
    const midiLyricsContainer = new Html("div")
      .classOn("midi-lyrics-container")
      .appendTo(bottomSection);
    const midiLineDisplay1 = new Html("div")
      .classOn("lyric-line", "midi-lyric-line")
      .appendTo(midiLyricsContainer);
    const midiLineDisplay2 = new Html("div")
      .classOn("lyric-line", "midi-lyric-line", "next")
      .appendTo(midiLyricsContainer);
    const playerProgress = new Html("div")
      .classOn("player-progress")
      .appendTo(bottomSection);
    const progressBar = new Html("div")
      .classOn("progress-bar")
      .appendTo(playerProgress);

    let countdownTimers = [];
    let nextLineUpdateTimeout = null;
    let countdownTargetTime = null;
    let lastCountdownTick = null;

    function animateNumber(element, target, duration, isFloat = true) {
      return new Promise((resolve) => {
        let start = 0;
        const currentText = element.getText();
        if (currentText && !isNaN(parseFloat(currentText))) {
          start = parseFloat(currentText);
        }
        const startTime = performance.now();
        const update = () => {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = start + (target - start) * progress;
          element.text(
            isFloat ? currentValue.toFixed(2) : Math.round(currentValue),
          );
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            element.text(isFloat ? target.toFixed(2) : Math.round(target));
            resolve();
          }
        };
        requestAnimationFrame(update);
      });
    }

    function animateGauge(gaugeElements, target, duration) {
      return new Promise((resolve) => {
        const { gauge, valueDisplay } = gaugeElements;
        let start = 0;
        const startTime = performance.now();
        const update = () => {
          const elapsed = performance.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentValue = start + (target - start) * progress;
          gauge.styleJs({ "--value": currentValue });
          valueDisplay.text(`${Math.round(currentValue)}%`);
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            gauge.styleJs({ "--value": target });
            valueDisplay.text(`${Math.round(target)}%`);
            resolve();
          }
        };
        requestAnimationFrame(update);
      });
    }

    async function showPostSongScreen(scoreData) {
      Forte.togglePianoRollVisibility(false);
      state.isTransitioning = true;
      finalScoreDisplay.text("0.00");
      [keyRhythmGauge, vibratoGauge, upbandGauge, downbandGauge].forEach(
        ({ gauge, valueDisplay }) => {
          gauge.styleJs({ "--value": 0 });
          valueDisplay.text("0%");
        },
      );
      postSongScoreScreen.classOn("visible");
      Forte.playSfx("/assets/audio/fanfare.mp3");
      await new Promise((r) => setTimeout(r, 500));
      await animateNumber(finalScoreDisplay, scoreData.finalScore, 2000, true);
      await Promise.all([
        animateGauge(keyRhythmGauge, scoreData.details.pitchAndRhythm, 1500),
        animateGauge(vibratoGauge, scoreData.details.vibrato, 1500),
        animateGauge(upbandGauge, scoreData.details.upband, 1500),
        animateGauge(downbandGauge, scoreData.details.downband, 1500),
      ]);
      await new Promise((r) => setTimeout(r, 7000));
      postSongScoreScreen.classOff("visible");
      await new Promise((r) => setTimeout(r, 500));
      state.isTransitioning = false;
    }

    async function runCalibrationSequence() {
      if (state.isTransitioning) return;
      state.isTransitioning = true;
      calibrationTitle.text("LATENCY COMPENSATION");
      calibrationText.html(
        "Please place your microphone near your speakers and ensure the room is quiet.<br>The test will begin in five (5) seconds...",
      );
      calibrationScreen.classOn("visible");
      await new Promise((r) => setTimeout(r, 5000));
      calibrationText.text("Calibrating... A series of beeps will play.");
      try {
        const latencyS = await Forte.runLatencyTest();
        const latencyMs = (latencyS * 1000).toFixed(0);
        const updatedConfig = JSON.parse(JSON.stringify(config));
        if (!updatedConfig.audioConfig) updatedConfig.audioConfig = {};
        updatedConfig.audioConfig.micLatency = latencyS;
        window.desktopIntegration.ipc.send("updateConfig", updatedConfig);
        calibrationTitle.text("CALIBRATION COMPLETE");
        calibrationText.text(`Measured audio latency is ${latencyMs} ms.`);
        InfoBar.showTemp(
          "CALIBRATION",
          `Success! Latency: ${latencyMs} ms`,
          5000,
        );
      } catch (e) {
        console.error("[Encore] Calibration failed:", e);
        calibrationTitle.text("CALIBRATION FAILED");
        calibrationText.html(
          `Could not get a reliable measurement.<br>Please check your microphone input, speaker volume, and reduce background noise.`,
        );
        InfoBar.showTemp("CALIBRATION", "Failed. Please try again.", 5000);
      }
      await new Promise((r) => setTimeout(r, 6000));
      calibrationScreen.classOff("visible");
      state.isTransitioning = false;
    }

    const toggleSearchOverlay = (visible) => {
      if (state.currentSongIsMultiplexed) {
        Forte.togglePianoRollVisibility(!visible);
      }
      if (visible) {
        state.isSearchOverlayVisible = true;
        wrapper.classOn("search-overlay-active");
        if (state.mode === "player") {
          wrapper.classOn("in-game-search-active");
        }
        searchInput.elm.focus();
        searchInput.elm.select();
      } else {
        state.isSearchOverlayVisible = false;
        wrapper.classOff("search-overlay-active", "in-game-search-active");
        searchWindow.classOff("has-results");
        searchInput.elm.blur();
        setTimeout(() => {
          if (state.isSearchOverlayVisible) return;
          searchInput.val("");
          state.searchResults = [];
          state.highlightedSearchIndex = -1;
          searchResultsContainer.clear();
        }, 300);
        if (state.mode === "player") {
          InfoBar.showDefault();
        }
      }
    };

    const setMode = (newMode) => {
      state.mode = newMode;
      wrapper.classOff(
        "mode-menu",
        "mode-player",
        "mode-yt-search",
        "mode-player-youtube",
      );
      wrapper.classOn(`mode-${newMode}`);

      overlay.classOn("hidden");
      playerUi.classOn("hidden");

      if (state.isSearchOverlayVisible) toggleSearchOverlay(false);

      if (newMode === "menu") {
        overlay.classOff("hidden");
        searchInput.elm.blur();
        InfoBar.hideBar();
        updateMenuUI();
      } else if (newMode === "player") {
        if (state.currentSongIsMultiplexed)
          Forte.togglePianoRollVisibility(true);
        playerUi.classOff("hidden");
        InfoBar.showDefault();
        InfoBar.showBar();
      } else if (newMode === "yt-search") {
        if (state.currentSongIsMultiplexed)
          Forte.togglePianoRollVisibility(false);
        searchInput.elm.focus();
        searchInput.elm.select();
      }
    };

    const renderSearchResults = () => {
      searchResultsContainer.clear();
      state.highlightedSearchIndex = -1;
      if (state.isSearching && state.searchResults.length === 0) {
        searchResultsContainer.text("Searching...");
        searchWindow.classOff("has-results");
        return;
      }
      if (state.searchResults.length === 0) {
        searchResultsContainer.text("No results found.");
        searchWindow.classOff("has-results");
        return;
      }
      searchWindow.classOn("has-results");

      state.searchResults.forEach((result, index) => {
        const item = new Html("div")
          .classOn("search-result-item")
          .appendTo(searchResultsContainer);

        item.on("click", () => {
          state.highlightedSearchIndex = index;
          handleEnter();
        });
        item.on("mouseover", () => {
          state.highlightedSearchIndex = index;
          updateSearchHighlight();
        });

        const info = new Html("div").classOn("search-info").appendTo(item);

        if (result.type === "local") {
          new Html("div")
            .classOn("search-result-local-code")
            .text(result.code)
            .appendTo(item);
          new Html("div")
            .classOn("search-title")
            .text(result.title)
            .appendTo(info);
          new Html("div")
            .classOn("search-channel")
            .text(result.artist)
            .appendTo(info);
        } else {
          // YouTube result
          const thumbWrapper = new Html("div")
            .classOn("search-thumbnail-wrapper")
            .appendTo(item);
          new Html("img")
            .classOn("search-thumbnail")
            .attr({ src: result.thumbnail.thumbnails[0].url })
            .appendTo(thumbWrapper);
          if (result.length && result.length.simpleText) {
            new Html("span")
              .classOn("search-duration")
              .text(result.length.simpleText)
              .appendTo(thumbWrapper);
          }
          const titleContainer = new Html("div")
            .styleJs({ display: "flex", alignItems: "center" })
            .appendTo(info);
          new Html("div")
            .classOn("search-title")
            .text(result.title)
            .appendTo(titleContainer);
          new Html("span")
            .classOn("search-youtube-badge")
            .text("YT")
            .appendTo(titleContainer);
          new Html("div")
            .classOn("search-channel")
            .text(result.channelTitle)
            .appendTo(info);
        }
      });
      updateSearchHighlight();
    };

    const updateMenuUI = () => {
      if (state.isTypingNumber) {
        wrapper.classOn("is-typing");
      } else {
        wrapper.classOff("is-typing");
      }

      let activeSong = null;
      let displayCode = state.songNumber.padStart(maxLength, "0");
      if (state.songNumber.length > 0) {
        state.highlightedIndex = -1;
        activeSong = songMap.get(displayCode);
      } else if (state.highlightedIndex >= 0) {
        activeSong = songList[state.highlightedIndex];
        if (activeSong) displayCode = activeSong.code;
      }
      numberDisplay.text(displayCode);
      if (activeSong) {
        numberDisplay.classOn("active");
        songTitle.text(activeSong.title);
        songArtist.text(activeSong.artist);
      } else {
        numberDisplay.classOff("active");
        songTitle.text(
          state.songNumber.length === maxLength ? "Song Not Found" : "",
        );
        songArtist.text("");
      }
      songItemElements.forEach((item, index) => {
        if (index === state.highlightedIndex) {
          item.classOn("highlighted");
          // --- MODIFIED: Fix scrolling to top item with arrow keys ---
          if (!state.isTypingNumber) {
            if (state.highlightedIndex === 0) {
              songListContainer.elm.scrollTop = 0;
            } else {
              item.elm.scrollIntoView({ block: "nearest" });
            }
          }
        } else {
          item.classOff("highlighted");
        }
      });
    };

    const updateSearchHighlight = () => {
      const items = searchResultsContainer.qsa(".search-result-item");
      if (!items) return;
      items.forEach((item, index) => {
        if (index === state.highlightedSearchIndex) {
          item.classOn("highlighted");
          item.elm.scrollIntoView({ block: "nearest" });
        } else {
          item.classOff("highlighted");
        }
      });
    };

    const performSearch = async () => {
      const query = searchInput.getValue().trim().toLowerCase();
      if (!query) {
        state.searchResults = [];
        renderSearchResults();
        return;
      }
      state.isSearching = true;

      let localResults = [];
      if (state.mode === "player" || state.mode === "yt-search") {
        if (/^\d+$/.test(query)) {
          songList.forEach((song) => {
            if (song.code.includes(query)) {
              localResults.push({ ...song, type: "local" });
            }
          });
        }
        songList.forEach((song) => {
          if (
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query)
          ) {
            if (!localResults.find((s) => s.code === song.code)) {
              localResults.push({ ...song, type: "local" });
            }
          }
        });
      }
      state.searchResults = [...localResults];
      renderSearchResults();

      try {
        const response = await fetch(
          `http://127.0.0.1:9864/yt-search?q=${encodeURIComponent(query)}`,
        );
        if (!response.ok) throw new Error("Search request failed");
        const data = await response.json();
        const ytItems = (data.items || [])
          .filter((item) => item.type === "video")
          .map((item) => ({ ...item, type: "youtube" }));

        state.searchResults = [...localResults, ...ytItems];
        renderSearchResults();
      } catch (error) {
        console.error("YouTube search failed:", error);
      } finally {
        state.isSearching = false;
      }
    };

    searchInput.on("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch();
      }
    });

    const startPlayer = async (song) => {
      state.isTransitioning = true;
      Recorder.setSongInfo(song);
      if (nextLineUpdateTimeout) clearTimeout(nextLineUpdateTimeout);
      countdownTimers.forEach(clearTimeout);
      nextLineUpdateTimeout = null;
      countdownTimers = [];
      countdownDisplay.classOff("visible").text("");
      if (timeUpdateHandler)
        document.removeEventListener(
          "CherryTree.Forte.Playback.TimeUpdate",
          timeUpdateHandler,
        );
      if (lyricEventHandler)
        document.removeEventListener(
          "CherryTree.Forte.Playback.LyricEvent",
          lyricEventHandler,
        );
      if (scoreUpdateHandler)
        document.removeEventListener(
          "CherryTree.Forte.Scoring.Update",
          scoreUpdateHandler,
        );
      timeUpdateHandler = null;
      lyricEventHandler = null;
      scoreUpdateHandler = null;
      lrcLineDisplay1.clear();
      lrcLineDisplay2.clear();
      midiLineDisplay1.clear();
      midiLineDisplay2.clear();
      ScoreHUD.hide();
      introCard.classOff("visible");
      state.currentSongIsYouTube = song.path.startsWith("yt://");
      state.currentSongIsMV = !!song.videoPath;
      state.reservationNumber = "";
      setMode("player");
      if (state.currentSongIsYouTube) {
        wrapper.classOn("mode-player-youtube");
      }
      window.desktopIntegration.ipc.send("setRPC", {
        details: song.title,
        state: song.artist,
      });

      // --- NEW: Broadcast currently playing song info ---
      socket.emit("broadcastData", {
        type: "now_playing",
        song: {
          code: song.code || null,
          title: song.title,
          artist: song.artist,
          path: song.path,
          isYouTube: song.path.startsWith("yt://"),
          isMV: !!song.videoPath,
        },
      });

      if (state.currentSongIsYouTube) {
        BGVPlayer.stop();
        bgvContainer.classOn("hidden");
        youtubePlayerContainer.classOff("hidden");
        const videoId = song.path.substring(5);
        youtubeIframe.attr({
          src: `https://cdpn.io/pen/debug/oNPzxKo?v=${videoId}&autoplay=1`,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        });
        lrcLyricsContainer.classOn("hidden");
        midiLyricsContainer.classOn("hidden");
        playerProgress.classOn("hidden");
        state.isTransitioning = false;
      } else {
        let mvPlayer = null;
        lrcLyricsContainer.styleJs({ opacity: "0" });
        midiLyricsContainer.styleJs({ opacity: "0" });
        if (state.currentSongIsMV) {
          console.log(`[Encore] Playing MV: ${song.videoPath}`);
          const videoUrl = new URL("http://127.0.0.1:9864/getFile");
          videoUrl.searchParams.append("path", song.videoPath);
          mvPlayer = await BGVPlayer.playSingleVideo(videoUrl.href);
        } else {
          BGVPlayer.resumePlaylist();
        }
        bgvContainer.classOff("hidden");
        youtubePlayerContainer.classOn("hidden");
        youtubeIframe.attr({ src: "" });
        lrcLyricsContainer.classOff("hidden");
        midiLyricsContainer.classOff("hidden");
        playerProgress.classOff("hidden");
        const trackUrl = new URL("http://127.0.0.1:9864/getFile");
        trackUrl.searchParams.append("path", song.path);
        await Forte.loadTrack(trackUrl.href);
        const playbackState = Forte.getPlaybackState();
        state.currentSongIsMultiplexed = playbackState.isMultiplexed;
        if (state.currentSongIsMultiplexed) {
          ScoreHUD.show(0);
          Forte.togglePianoRollVisibility(true);
        }
        introCardTitle.text(song.title);
        introCardArtist.text(song.artist);
        introCard.classOn("visible");
        let lrcParsedLyrics = [],
          currentLrcIndex = -1;
        let countdownTargetTime = null;
        let lastCountdownTick = null;
        // Set a target time for the countdown. The actual displayed tick will be
        // derived from Forte time updates so it follows playbackRate changes.
        const scheduleCountdown = (targetTime /*, _currentTime */) => {
          // clear any old timers (kept for backwards compatibility)
          countdownTimers.forEach(clearTimeout);
          countdownTimers = [];
          countdownTargetTime = targetTime;
          lastCountdownTick = null;
          countdownDisplay.classOff("visible").text("");
        };
        if (playbackState.isMidi) {
          midiLyricsContainer.styleJs({ display: "flex" });
          lrcLyricsContainer.styleJs({ display: "none" });
          const allSyllables = [];
          const lines = [];
          let currentLineSyllables = [];
          let displayableSyllableIndex = 0;
          for (const syllableText of playbackState.decodedLyrics) {
            const isNewLine = /[\r\n\/\\]/.test(syllableText);
            const cleanText = syllableText.replace(/[\r\n\/\\]/g, "");
            if (cleanText) {
              const romanized = await Romanizer.romanize(cleanText);
              const syllable = {
                text: cleanText,
                romanized: romanized,
                globalIndex: displayableSyllableIndex,
                lineIndex: lines.length,
              };
              allSyllables.push(syllable);
              currentLineSyllables.push(syllable);
              displayableSyllableIndex++;
            }
            if (isNewLine && currentLineSyllables.length > 0) {
              lines.push(currentLineSyllables);
              currentLineSyllables = [];
            }
          }
          if (currentLineSyllables.length > 0) lines.push(currentLineSyllables);
          const displayLines = [midiLineDisplay1, midiLineDisplay2];
          let currentSongLineIndex = -1;
          const renderLine = (displayEl, lineData) => {
            displayEl.clear();
            if (!lineData) return;
            lineData.forEach((s) => {
              const container = new Html("div")
                .classOn("lyric-syllable-container")
                .attr({ "data-index": s.globalIndex })
                .appendTo(displayEl);
              new Html("span")
                .classOn("lyric-syllable-original")
                .attr({ "data-text": s.text })
                .text(s.text)
                .appendTo(container);
              if (s.romanized) {
                new Html("span")
                  .classOn("lyric-syllable-romanized")
                  .attr({ "data-text": s.romanized })
                  .text(s.romanized)
                  .appendTo(container);
              }
            });
          };
          displayLines.forEach((line) =>
            line.clear().classOff("active", "next"),
          );
          renderLine(displayLines[0], lines[0]);
          renderLine(displayLines[1], lines[1]);
          displayLines[0].classOn("active");
          displayLines[1].classOn("next");
          lyricEventHandler = (e) => {
            const { index } = e.detail;
            if (index >= allSyllables.length) return;
            const activeSyllable = allSyllables[index];
            if (activeSyllable.lineIndex !== currentSongLineIndex) {
              currentSongLineIndex = activeSyllable.lineIndex;
              const activeDisplay = displayLines[currentSongLineIndex % 2];
              const nextDisplay = displayLines[(currentSongLineIndex + 1) % 2];
              activeDisplay.classOn("active").classOff("next");
              nextDisplay.classOff("active").classOn("next");
              renderLine(nextDisplay, lines[currentSongLineIndex + 1]);
            }
            const newSyllableEl = wrapper.qs(
              `.lyric-syllable-container[data-index="${index}"]`,
            );
            if (newSyllableEl) newSyllableEl.classOn("active");
          };
          document.addEventListener(
            "CherryTree.Forte.Playback.LyricEvent",
            lyricEventHandler,
          );
        } else if (song.lrcPath) {
          midiLyricsContainer.styleJs({ display: "none" });
          lrcLyricsContainer.styleJs({ display: "flex" });
          const lrcText = await FsSvc.readFile(song.lrcPath);
          const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
          if (lrcText) {
            const lines = lrcText.split("\n");
            const lyricPromises = lines.map(async (line) => {
              const match = line.match(timeRegex);
              if (!match) return null;
              const time =
                parseInt(match[1]) * 60 +
                parseInt(match[2]) +
                parseInt(match[3].padEnd(3, "0")) / 1000;
              const text = line.replace(timeRegex, "").trim();
              if (!text) return null;
              const romanized = await Romanizer.romanize(text);
              return { time, text, romanized };
            });
            lrcParsedLyrics = (await Promise.all(lyricPromises)).filter(
              Boolean,
            );
          }
        }
        if (state.currentSongIsMultiplexed) {
          scoreUpdateHandler = (e) => {
            const scoreData = e.detail;
            ScoreHUD.show(scoreData.finalScore);
          };
          document.addEventListener(
            "CherryTree.Forte.Scoring.Update",
            scoreUpdateHandler,
          );
        }
        const PRE_ROLL_DELAY_MS = 2500;
        setTimeout(() => {
          if (state.mode !== "player") {
            state.isTransitioning = false;
            return;
          }
          introCard.classOff("visible");
          lrcLyricsContainer.styleJs({ opacity: "1" });
          midiLyricsContainer.styleJs({ opacity: "1" });
          if (lrcParsedLyrics.length > 0) {
            const lrcDisplayLines = [lrcLineDisplay1, lrcLineDisplay2];
            const renderLrcLine = (displayEl, lineData) => {
              displayEl.clear();
              if (!lineData) return;
              new Html("div")
                .classOn("lyric-line-original")
                .text(lineData.text)
                .appendTo(displayEl);
              if (lineData.romanized) {
                new Html("div")
                  .classOn("lyric-line-romanized")
                  .text(lineData.romanized)
                  .appendTo(displayEl);
              }
            };
            lrcDisplayLines.forEach((line) =>
              line.clear().classOff("active", "next"),
            );
            renderLrcLine(lrcDisplayLines[0], lrcParsedLyrics[0]);
            renderLrcLine(lrcDisplayLines[1], lrcParsedLyrics[1]);
            lrcDisplayLines[1].classOn("next");
            if (lrcParsedLyrics[0].time > 8.0) {
              scheduleCountdown(lrcParsedLyrics[0].time);
            }
          }
          if (mvPlayer) mvPlayer.play().catch(console.error);
          Forte.playTrack();
          state.isTransitioning = false;
        }, PRE_ROLL_DELAY_MS);
        timeUpdateHandler = (e) => {
          const { currentTime, duration } = e.detail;
          progressBar.styleJs({ width: `${(currentTime / duration) * 100}%` });
          if (mvPlayer) {
            const TOLERANCE_MS = 50,
              HARD_SYNC_THRESHOLD_MS = 500,
              CORRECTION_RATE = 1.05;
            const targetVideoTime = currentTime + state.videoSyncOffset / 1000;
            const driftMs = (targetVideoTime - mvPlayer.currentTime) * 1000;
            if (Math.abs(driftMs) > HARD_SYNC_THRESHOLD_MS) {
              mvPlayer.currentTime = targetVideoTime;
              mvPlayer.playbackRate = 1.0;
            } else if (Math.abs(driftMs) > TOLERANCE_MS) {
              mvPlayer.playbackRate =
                driftMs > 0 ? CORRECTION_RATE : 1.0 / CORRECTION_RATE;
            } else if (mvPlayer.playbackRate !== 1.0) {
              mvPlayer.playbackRate = 1.0;
            }
          }
          // Drive countdown display from the authoritative playback currentTime.
          if (countdownTargetTime !== null) {
            const remaining = countdownTargetTime - currentTime;
            let tick = null;
            if (remaining > 3) tick = null;
            else if (remaining > 2) tick = "3";
            else if (remaining > 1) tick = "2";
            else if (remaining > 0) tick = "1";
            else {
              // countdown reached or passed target
              tick = null;
              countdownTargetTime = null;
            }
            if (tick !== lastCountdownTick) {
              lastCountdownTick = tick;
              if (tick === null) countdownDisplay.classOff("visible").text("");
              else countdownDisplay.text(tick).classOn("visible");
            }
          }
          if (lrcParsedLyrics.length === 0 || playbackState.isMidi) return;
          let newIndex = -1;
          for (let i = lrcParsedLyrics.length - 1; i >= 0; i--)
            if (currentTime >= lrcParsedLyrics[i].time) {
              newIndex = i;
              break;
            }
          if (newIndex !== currentLrcIndex) {
            if (nextLineUpdateTimeout) clearTimeout(nextLineUpdateTimeout);
            currentLrcIndex = newIndex;
            if (newIndex < 0) return;
            const lrcDisplayLines = [lrcLineDisplay1, lrcLineDisplay2];
            const renderLrcLine = (displayEl, lineData) => {
              displayEl.clear();
              if (!lineData) return;
              new Html("div")
                .classOn("lyric-line-original")
                .text(lineData.text)
                .appendTo(displayEl);
              if (lineData.romanized) {
                new Html("div")
                  .classOn("lyric-line-romanized")
                  .text(lineData.romanized)
                  .appendTo(displayEl);
              }
            };
            const activeDisplay = lrcDisplayLines[currentLrcIndex % 2];
            const nextDisplay = lrcDisplayLines[(currentLrcIndex + 1) % 2];
            activeDisplay.classOn("active").classOff("next");
            nextDisplay.classOff("active").classOn("next");
            const currentLine = lrcParsedLyrics[currentLrcIndex];
            const nextLine = lrcParsedLyrics[currentLrcIndex + 1];
            let lineDurationMs = 5000;
            if (nextLine) {
              lineDurationMs = (nextLine.time - currentLine.time) * 1000;
              if (lineDurationMs / 1000 > 8.0) {
                scheduleCountdown(nextLine.time);
              }
            }
            const delay = lineDurationMs / 2;
            nextLineUpdateTimeout = setTimeout(() => {
              renderLrcLine(nextDisplay, nextLine);
            }, delay);
          }
        };
        document.addEventListener(
          "CherryTree.Forte.Playback.TimeUpdate",
          timeUpdateHandler,
        );
      }
    };

    const stopPlayer = () => {
      Recorder.clearSongInfo();
      introCard.classOff("visible");
      youtubePlayerContainer.classOn("hidden");
      youtubeIframe.attr({ src: "" });
      bgvContainer.classOff("hidden");
      Forte.stopTrack();
      if (nextLineUpdateTimeout) clearTimeout(nextLineUpdateTimeout);
      countdownTimers.forEach(clearTimeout);
      nextLineUpdateTimeout = null;
      countdownTimers = [];
      countdownTargetTime = null;
      lastCountdownTick = null;
      countdownDisplay.classOff("visible").text("");
    };

    const transitionAfterSong = () => {
      if (state.reservationQueue.length > 0) {
        const nextSong = state.reservationQueue.shift();
        InfoBar.showDefault();
        if (nextSong) {
          setTimeout(() => startPlayer(nextSong), 250);
        }
      } else {
        setMode("menu");
        window.desktopIntegration.ipc.send("setRPC", {
          details: `Browsing ${songList.length} Songs...`,
          state: `Main Menu`,
        });
      }
    };

    const handleSubmit = () => {
      let songToPlay = null;
      if (state.songNumber.length > 0)
        songToPlay = songMap.get(state.songNumber.padStart(maxLength, "0"));
      else if (state.highlightedIndex >= 0)
        songToPlay = songList[state.highlightedIndex];
      if (songToPlay) {
        state.songNumber = "";
        state.highlightedIndex = -1;
        state.isTypingNumber = false;
        startPlayer(songToPlay);
      }
    };

    const handleDigitInput = (digit) => {
      const target =
        state.mode === "player" ? "reservationNumber" : "songNumber";
      state[target] =
        state[target].length >= maxLength ? digit : state[target] + digit;
      if (state.mode !== "player") {
        Forte.playSfx(`/assets/audio/numbers/${digit}.wav`);
        state.isTypingNumber = true;
      }
      if (state.mode === "player") {
        InfoBar.showReservation(state[target]);
      } else {
        updateMenuUI();
      }
    };

    const handleBackspace = () => {
      if (state.isSearchOverlayVisible && searchInput.getValue().length === 0) {
        toggleSearchOverlay(false);
      } else if (state.mode === "player" && !state.isSearchOverlayVisible) {
        if (state.reservationNumber.length > 0) {
          state.reservationNumber = state.reservationNumber.slice(0, -1);
          if (state.reservationNumber.length > 0) {
            InfoBar.showReservation(state.reservationNumber);
          } else {
            InfoBar.showDefault();
          }
        }
      } else if (state.mode === "menu") {
        if (state.songNumber.length > 0) {
          state.songNumber = state.songNumber.slice(0, -1);
          if (state.songNumber.length === 0) {
            state.isTypingNumber = false;
          }
          updateMenuUI();
        }
      } else if (
        state.mode === "yt-search" &&
        searchInput.getValue().length === 0
      ) {
        setMode("menu");
      }
    };

    const handleEnter = () => {
      if (state.mode === "menu") {
        if (state.reservationQueue.length > 0) {
          const nextSong = state.reservationQueue.shift();
          startPlayer(nextSong);
        } else {
          handleSubmit();
        }
      } else if (state.mode === "player") {
        if (state.isSearchOverlayVisible) {
          if (state.highlightedSearchIndex !== -1) {
            const result = state.searchResults[state.highlightedSearchIndex];
            if (result) {
              let songToReserve;
              if (result.type === "local") {
                songToReserve = { ...result };
              } else {
                // YouTube
                songToReserve = {
                  title: result.title,
                  artist: result.channelTitle,
                  path: `yt://${result.id}`,
                };
              }

              state.reservationQueue.push(songToReserve);
              const codeSpan = songToReserve.code
                ? `<span class="info-bar-code">${songToReserve.code}</span>`
                : `<span class="info-bar-code is-youtube">YT</span>`;

              InfoBar.showTemp(
                "RESERVED",
                `${codeSpan} ${songToReserve.title}`,
                4000,
              );
              toggleSearchOverlay(false);
            }
          }
        } else {
          if (state.reservationNumber.length > 0) {
            const code = state.reservationNumber.padStart(maxLength, "0");
            const song = songMap.get(code);
            if (song) {
              state.reservationQueue.push(song);
              state.reservationNumber = "";
              InfoBar.showDefault();
            }
          }
        }
      } else if (state.mode === "yt-search") {
        if (state.highlightedSearchIndex !== -1) {
          const result = state.searchResults[state.highlightedSearchIndex];
          if (result) {
            let songToPlay;
            if (result.type === "local") {
              songToPlay = { ...result };
            } else {
              // YouTube
              songToPlay = {
                title: result.title,
                artist: result.channelTitle,
                path: `yt://${result.id}`,
              };
            }
            startPlayer(songToPlay);
          }
        }
      }
    };

    const handleEscape = () => {
      if (state.isTransitioning) return;
      if (state.isSearchOverlayVisible) {
        toggleSearchOverlay(false);
        return;
      }
      if (state.mode === "menu" && state.isTypingNumber) {
        state.songNumber = "";
        state.isTypingNumber = false;
        updateMenuUI();
        return;
      }
      if (state.mode === "player" || state.mode === "mode-player-youtube") {
        if (state.reservationNumber.length > 0) {
          state.reservationNumber = "";
          InfoBar.showDefault();
        } else {
          if (state.currentSongIsYouTube) {
            stopPlayer();
            BGVPlayer.start();
            transitionAfterSong();
          } else {
            Forte.stopTrack();
          }
        }
      } else if (state.mode === "yt-search") {
        setMode("menu");
      }
    };

    const handleVolume = (direction) => {
      const change = direction === "up" ? 0.05 : -0.05;
      state.volume = Math.max(0, Math.min(1, state.volume + change));
      Forte.setTrackVolume(state.volume);
      const volumePercent = Math.round(state.volume * 100);
      const volumeContent = `<div class="volume-display"><div class="volume-slider-container"><div class="volume-slider-fill" style="width: ${volumePercent}%"></div></div><span class="volume-percentage">${volumePercent}%</span></div>`;
      InfoBar.showTemp("VOLUME", volumeContent, 3000);
      const updatedConfig = {
        ...config,
        audioConfig: {
          ...config.audioConfig,
          mix: {
            ...config.audioConfig.mix,
            instrumental: {
              ...config.audioConfig.mix.instrumental,
              volume: state.volume,
            },
          },
        },
      };
      window.desktopIntegration.ipc.send("updateConfig", updatedConfig);
    };

    const handleTranspose = (direction) => {
      if (state.mode !== "player" || state.currentSongIsYouTube) return;
      const playbackState = Forte.getPlaybackState();
      const change = direction === "up" ? 1 : -1;
      const newTranspose = Math.max(
        -24,
        Math.min(24, (playbackState.transpose || 0) + change),
      );
      Forte.setTranspose(newTranspose);
      InfoBar.showTemp(
        "TRANSPOSE",
        `${newTranspose > 0 ? "+" : ""}${newTranspose}`,
        3000,
      );
    };

    const handleVideoSync = (direction) => {
      if (state.mode !== "player" || !state.currentSongIsMV) return;
      state.videoSyncOffset += direction === "up" ? 10 : -10;
      InfoBar.showTemp(
        "VIDEO SYNC",
        `${state.videoSyncOffset > 0 ? "+" : ""}${state.videoSyncOffset} ms`,
        3000,
      );
      const updatedConfig = JSON.parse(JSON.stringify(config));
      if (!updatedConfig.videoConfig) updatedConfig.videoConfig = {};
      updatedConfig.videoConfig.syncOffset = state.videoSyncOffset;
      window.desktopIntegration.ipc.send("updateConfig", updatedConfig);
    };

    const handleMultiplexPan = (direction) => {
      const playbackState = Forte.getPlaybackState();
      if (state.mode !== "player" || !playbackState.isMultiplexed) return;
      const change = direction === "right" ? 0.2 : -0.2;
      const newPan = parseFloat(
        Math.max(-1, Math.min(1, playbackState.multiplexPan + change)).toFixed(
          1,
        ),
      );
      Forte.setMultiplexPan(newPan);
      let displayText = "BALANCED";
      if (newPan <= -0.99) displayText = "INSTRUMENTAL";
      else if (newPan >= 0.99) displayText = "VOCAL GUIDE";
      else if (newPan < 0)
        displayText = `◀ ${Math.abs(Math.round(newPan * 100))}% INST`;
      else if (newPan > 0) displayText = `VOC ${Math.round(newPan * 100)}% ▶`;
      InfoBar.showTemp("VOCAL BALANCE", displayText, 3000);
    };

    const handleMenuNav = (direction) => {
      if (state.mode !== "menu") return;
      const change = direction === "down" ? 1 : -1;
      if (state.songNumber.length > 0) {
        state.songNumber = "";
        state.isTypingNumber = false;
      }
      let newIndex = state.highlightedIndex;
      if (change > 0)
        newIndex = Math.min(
          songList.length - 1,
          newIndex < 0 ? 0 : newIndex + 1,
        );
      else newIndex = Math.max(0, newIndex - 1);
      if (newIndex !== state.highlightedIndex) {
        state.highlightedIndex = newIndex;
      }
      updateMenuUI();
    };

    const handleSearchNav = (direction) => {
      if (state.mode !== "yt-search" && !state.isSearchOverlayVisible) return;
      const change = direction === "down" ? 1 : -1;
      const isSearchInputFocused = document.activeElement === searchInput.elm;
      if (isSearchInputFocused && change > 0) {
        searchInput.elm.blur();
        state.highlightedSearchIndex = 0;
      } else if (
        !isSearchInputFocused &&
        change < 0 &&
        state.highlightedSearchIndex <= 0
      ) {
        state.highlightedSearchIndex = -1;
        searchInput.elm.focus();
      } else if (state.searchResults.length > 0) {
        state.highlightedSearchIndex = Math.max(
          0,
          Math.min(
            state.searchResults.length - 1,
            state.highlightedSearchIndex + change,
          ),
        );
      }
      updateSearchHighlight();
    };

    keydownHandler = (e) => {
      if (MixerUI.isVisible) {
        MixerUI.handleKeyDown(e);
        return;
      }

      const isSearchInputFocused = document.activeElement === searchInput.elm;
      if (isSearchInputFocused) {
        if (e.key === "Backspace" && searchInput.getValue().length === 0) {
          e.preventDefault();
          handleBackspace();
          return;
        }
        if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
          e.preventDefault();
        } else {
          return;
        }
      } else {
        e.preventDefault();
      }

      if (e.key.toLowerCase() === "m") {
        MixerUI.toggle();
        return;
      }

      if (e.key.toLowerCase() === "r") {
        if (state.mode === "player" && !state.currentSongIsYouTube) {
          Recorder.toggle();
        }
        return;
      }
      if (e.key >= "0" && e.key <= "9") handleDigitInput(e.key);
      else if (e.key === "Backspace") handleBackspace();
      else if (e.key === "Enter") handleEnter();
      else if (e.key === "Escape") handleEscape();
      else if (e.key === "ArrowUp") {
        if (state.mode === "menu") handleMenuNav("up");
        else if (state.mode === "yt-search" || state.isSearchOverlayVisible)
          handleSearchNav("up");
        else if (state.mode === "player") handleTranspose("up");
      } else if (e.key === "ArrowDown") {
        if (state.mode === "menu") handleMenuNav("down");
        else if (state.mode === "yt-search" || state.isSearchOverlayVisible)
          handleSearchNav("down");
        else if (state.mode === "player") handleTranspose("down");
      } else if (e.key === "ArrowLeft") {
        handleMultiplexPan("left");
      } else if (e.key === "ArrowRight") {
        handleMultiplexPan("right");
      } else if (e.key === "-") handleVolume("down");
      else if (e.key === "=") handleVolume("up");
      else if (e.key === "[" || e.key === "]") {
        if (state.currentSongIsMV) {
          handleVideoSync(e.key === "]" ? "up" : "down");
        } else {
          BGVPlayer.cycleCategory(e.key === "[" ? -1 : 1);
          const allCategoryNames = [
            "Auto",
            ...BGVPlayer.categories.map((c) => c.BGV_CATEGORY),
          ];
          const content = allCategoryNames
            .map((cat) =>
              cat === BGVPlayer.selectedCategory
                ? `<span class="bgv-category-item selected">${cat}</span>`
                : `<span class="bgv-category-item">${cat}</span>`,
            )
            .join("");
          InfoBar.showTemp("BGV", content, 3000);
        }
      } else if (e.key.toLowerCase() === "y") {
        if (state.isTransitioning) return;
        if (state.mode === "menu") setMode("yt-search");
        else if (state.mode === "player")
          toggleSearchOverlay(!state.isSearchOverlayVisible);
      } else if (e.key.toLowerCase() === "c") {
        if (state.mode === "menu") {
          runCalibrationSequence();
        }
      }
    };

    socket.on("connect", () => console.log("[LINK] Connected to server."));
    const validateAndReserveSong = (code) => {
      const displayCode = code.padStart(maxLength, "0");
      const song = songMap.get(displayCode);
      if (song) {
        if (state.mode === "menu") {
          startPlayer(song);
        } else {
          state.reservationQueue.push(song);
          InfoBar.showDefault();
        }
        return { success: true, song };
      }
      return { success: false };
    };
    socket.on("execute-command", (commandObj) => {
      let data = commandObj.data;
      switch (data.type) {
        case "digit":
          handleDigitInput(data.value);
          break;
        case "backspace":
          handleBackspace();
          break;
        case "reserve":
        case "enter":
          handleEnter();
          break;
        case "stop":
          handleEscape();
          break;
        case "vol_up":
          handleVolume("up");
          break;
        case "vol_down":
          handleVolume("down");
          break;
        case "key_up":
          handleTranspose("up");
          break;
        case "key_down":
          handleTranspose("down");
          break;
        case "pan_left":
          handleMultiplexPan("left");
          break;
        case "pan_right":
          handleMultiplexPan("right");
          break;
        case "toggle_recording":
          if (state.mode === "player" && !state.currentSongIsYouTube) {
            Recorder.toggle();
          }
          break;
        case "toggle_bgv":
          if (!state.currentSongIsMV) {
            BGVPlayer.cycleCategory(1);
            const allCategoryNames = [
              "Auto",
              ...BGVPlayer.categories.map((c) => c.BGV_CATEGORY),
            ];
            const content = allCategoryNames
              .map((cat) =>
                cat === BGVPlayer.selectedCategory
                  ? `<span class="bgv-category-item selected">${cat}</span>`
                  : `<span class="bgv-category-item">${cat}</span>`,
              )
              .join("");
            InfoBar.showTemp("BGV", content, 3000);
          }
          break;
        case "yt_search_open":
          if (!state.isTransitioning) {
            if (state.mode === "menu") setMode("yt-search");
            else if (state.mode === "player") toggleSearchOverlay(true);
          }
          break;
        case "yt_search_close":
          if (state.mode === "yt-search") setMode("menu");
          else if (state.isSearchOverlayVisible) toggleSearchOverlay(false);
          break;
        case "nav_up":
          handleSearchNav("up");
          break;
        case "nav_down":
          handleSearchNav("down");
          break;
        case "yt_search_query":
          searchInput.elm.value = data.value;
          performSearch();
          break;
        case "get_song_list":
          socket.emit("sendData", {
            identity: commandObj.identity,
            data: { type: "songlist", contents: songList },
          });
          break;
        case "reserve_code":
          const result = validateAndReserveSong(data.value);
          socket.emit("sendData", {
            identity: commandObj.identity,
            data: {
              type: "reserve_response",
              success: result.success,
              song: result.success
                ? {
                    code: result.song.code,
                    title: result.song.title,
                    artist: result.song.artist,
                  }
                : null,
            },
          });
          break;
      }
    });

    playbackUpdateHandler = async (e) => {
      const { status } = e.detail || {};
      if (
        (state.mode === "player" || state.mode === "mode-player-youtube") &&
        lastPlaybackStatus === "playing" &&
        status === "stopped"
      ) {
        if (state.isTransitioning) return;
        state.isTransitioning = true;
        Forte.togglePianoRollVisibility(false);
        if (Recorder.isRecording) {
          Recorder.stop();
        }
        const wasMultiplexed = state.currentSongIsMultiplexed;
        const wasMV = state.currentSongIsMV;
        ScoreHUD.hide();
        if (wasMV) {
          await BGVPlayer.resumePlaylist();
        }
        stopPlayer();
        if (wasMultiplexed) {
          const finalScoreData = Forte.getPlaybackState().score;
          await showPostSongScreen(finalScoreData);
        }
        transitionAfterSong();
        setTimeout(() => {
          if (state.reservationQueue.length === 0)
            state.isTransitioning = false;
        }, 1500);
      }
      lastPlaybackStatus = status;
    };
    document.addEventListener(
      "CherryTree.Forte.Playback.Update",
      playbackUpdateHandler,
    );

    window.addEventListener("keydown", keydownHandler);

    wrapper.classOn("loading");
    document.dispatchEvent(
      new CustomEvent("CherryTree.Loading.SetText", {
        detail: "Loading BGVs...",
      }),
    );

    await BGVPlayer.init(bgvContainer);

    Recorder.init(wrapper, Forte, BGVPlayer, {
      playerUi: playerUi,
      lrcLineDisplay1: lrcLineDisplay1,
      lrcLineDisplay2: lrcLineDisplay2,
      progressBar: progressBar,
      scoreDisplay: ScoreHUD.scoreDisplay,
    });

    await BGVPlayer.loadManifestCategories();
    const mtvPaths = songList
      .filter((song) => song.videoPath)
      .map((song) => song.videoPath);
    if (mtvPaths.length > 0) {
      BGVPlayer.addDynamicCategory({
        BGV_CATEGORY: "MTV",
        BGV_LIST: mtvPaths,
        isAbsolute: true,
      });
      console.log(
        `[BGV] Injected "MTV" category with ${mtvPaths.length} videos.`,
      );
    }
    await BGVPlayer.updatePlaylistForCategory();
    setTimeout(() => {
      wrapper.classOff("loading");
      Ui.transition("fadeIn", wrapper);
      setMode("menu");
    }, 100);
  },
  end: async function () {
    if (keydownHandler) window.removeEventListener("keydown", keydownHandler);
    if (timeUpdateHandler)
      document.removeEventListener(
        "CherryTree.Forte.Playback.TimeUpdate",
        timeUpdateHandler,
      );
    if (playbackUpdateHandler)
      document.removeEventListener(
        "CherryTree.Forte.Playback.Update",
        playbackUpdateHandler,
      );
    if (lyricEventHandler)
      document.removeEventListener(
        "CherryTree.Forte.Playback.LyricEvent",
        lyricEventHandler,
      );
    if (scoreUpdateHandler)
      document.removeEventListener(
        "CherryTree.Forte.Scoring.Update",
        scoreUpdateHandler,
      );
    keydownHandler = null;
    timeUpdateHandler = null;
    playbackUpdateHandler = null;
    lyricEventHandler = null;
    scoreUpdateHandler = null;
    lastPlaybackStatus = null;
    if (Recorder.isRecording) {
      Recorder.stop();
    }
    BGVPlayer.stop();
    Forte.stopTrack();
    Ui.cleanup(Pid);
    Ui.giveUpUi(Pid);
    wrapper.cleanup();
  },
};

export default pkg;
