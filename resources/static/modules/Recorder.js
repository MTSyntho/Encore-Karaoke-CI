import Html from "/libs/html.js";

/**
 * RecorderModule - Handles video recording of karaoke performances inside Encore with real-time UI overlay.
 * @class
 */
export class RecorderModule {
  constructor(forteSvc, bgvModule, infoBarModule, dialogShow) {
    this.forteSvc = forteSvc;
    this.bgvPlayer = bgvModule;
    this.infoBar = infoBarModule;
    this.dialogShow = dialogShow;
    this.isRecording = false;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.animationFrameId = null;
    this.currentSongInfo = null;
    this.uiRefs = null;
    this.parentContainer = null;
    this.currentStream = null;
    this.outputResolution = { width: 1280, height: 720 };

    // Canvas & Contexts
    this.canvas = null;
    this.ctx = null;
    this.offscreenCanvas = null;
    this.oCtx = null;

    // Optimization Caches & Interpolation States
    this.lyricCaches = new WeakMap();
    this.metaCanvas = null;
    this.bgvCanvas = null;
    this.bgvCtx = null;

    // Pre-rendered gradients
    this.lyricGradient = null;
    this.countdownGradient = null;

    this.bgvCurrentOpacity = 1.0;
    this.lyricOpacity = 1.0;

    // Throttle DOM checks
    this.frameCounter = 0;
    this.isInterludeVisible = false;
    this.cachedInterludeTip = "";

    console.log("[RECORDER] Video Recording feature initialized.");
  }

  /**
   * Mounts the recorder module to a DOM container.
   * @param {HTMLElement} container - The parent DOM container for canvas elements
   */
  mount(container) {
    this.parentContainer = container;
  }

  /**
   * Initialize canvas elements for recording - output canvas, offscreen buffer, and BGV cache.
   * @private
   */
  _initCanvas() {
    if (this.canvas) return;

    this.canvas = new Html("canvas")
      .attr({
        width: this.outputResolution.width,
        height: this.outputResolution.height,
      })
      .styleJs({ display: "none" })
      .appendTo(this.parentContainer).elm;

    this.ctx = this.canvas.getContext("2d", { alpha: false });

    if (typeof OffscreenCanvas !== "undefined") {
      this.offscreenCanvas = new OffscreenCanvas(
        this.outputResolution.width,
        this.outputResolution.height,
      );
    } else {
      this.offscreenCanvas = document.createElement("canvas");
      this.offscreenCanvas.width = this.outputResolution.width;
      this.offscreenCanvas.height = this.outputResolution.height;
    }
    this.oCtx = this.offscreenCanvas.getContext("2d", {
      alpha: false,
      willReadFrequently: false,
    });

    this.bgvCanvas = document.createElement("canvas");
    this.bgvCanvas.width = this.outputResolution.width;
    this.bgvCanvas.height = this.outputResolution.height;
    this.bgvCtx = this.bgvCanvas.getContext("2d", { alpha: false });
    this.bgvCtx.fillStyle = "black";
    this.bgvCtx.fillRect(0, 0, this.bgvCanvas.width, this.bgvCanvas.height);

    this._preRenderGradients();
  }

  /**
   * Pre-render gradient patterns for lyric and countdown displays.
   * @private
   */
  _preRenderGradients() {
    const w = this.outputResolution.width;
    const h = this.outputResolution.height;

    this.lyricGradient = this.oCtx.createLinearGradient(0, h * 0.4, 0, h);
    this.lyricGradient.addColorStop(0, "rgba(0,0,0,0)");
    this.lyricGradient.addColorStop(1, "rgba(0,0,0,0.9)");

    const cx = w / 2;
    const cy = h * 0.52;
    const radius = h * 0.08;
    this.countdownGradient = this.oCtx.createRadialGradient(
      cx,
      cy + radius * 0.2,
      0,
      cx,
      cy + radius * 0.2,
      radius * 1.2,
    );
    this.countdownGradient.addColorStop(0, "#f7b733");
    this.countdownGradient.addColorStop(1, "#fc4a1a");
  }

  /**
   * Sets references to UI elements for rendering.
   * @param {Object} refs - Object containing UI element references
   */
  setUiRefs(refs) {
    this.uiRefs = refs;
  }

  /**
   * Sets the current song information and pre-renders metadata.
   * @param {Object} song - Song object with title and artist properties
   */
  setSongInfo(song) {
    if (song) {
      this.currentSongInfo = { title: song.title, artist: song.artist };
      this._preRenderMeta();
    }
  }

  /**
   * Clears song information and associated metadata canvas.
   */
  clearSongInfo() {
    this.currentSongInfo = null;
    this.metaCanvas = null;
  }

  /**
   * Toggles recording state between active and inactive.
   */
  toggle() {
    this.isRecording ? this.stop() : this.start();
  }

  /**
   * Starts video recording with audio and video streams.
   * Initializes canvas, media recorder, and begins frame rendering.
   */
  start() {
    if (this.isRecording || !this.forteSvc || !this.bgvPlayer) return;

    this._initCanvas();
    this.bgvCurrentOpacity = 1.0;
    this.lyricOpacity = 1.0;
    this.frameCounter = 0;

    let audioStream;
    try {
      audioStream = this.forteSvc.getRecordingAudioStream();
      if (!audioStream || audioStream.getAudioTracks().length === 0) {
        this.infoBar.showTemp(
          "RECORDING",
          "Error: No audio stream found.",
          4000,
        );
        return;
      }
    } catch (e) {
      this.infoBar.showTemp("RECORDING", e, 4000);
      this.dialogShow(
        new Html("div").classOn("temp-dialog-text").text("NOT AVAILABLE"),
        2000,
      );
      return;
    }

    const videoStream = this.canvas.captureStream(30);

    this.currentStream = new MediaStream([
      videoStream.getVideoTracks()[0],
      audioStream.getAudioTracks()[0],
    ]);

    this.recordedChunks = [];
    try {
      const mimeOptions = [
        "video/webm; codecs=h264,opus",
        "video/webm; codecs=h264",
        "video/webm; codecs=vp8,opus",
        "video/webm; codecs=vp8",
        "video/webm",
      ];
      const selectedMime =
        mimeOptions.find((mime) => MediaRecorder.isTypeSupported(mime)) || "";

      this.mediaRecorder = new MediaRecorder(this.currentStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 2500000,
      });
      this.dialogShow(
        new Html("div").classOn("temp-dialog-text").text("RECORD STARTED"),
        2000,
      );
    } catch (e) {
      console.error("Failed to create MediaRecorder:", e);
      this.infoBar.showTemp(
        "RECORDING",
        "Error: Could not start recorder.",
        4000,
      );
      return;
    }

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this.recordedChunks.push(event.data);
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: "video/webm" });
      this.recordedChunks = [];

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = `Encore-Recording-${new Date().toISOString().replace(/:/g, "-")}.webm`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.infoBar.showTemp(
        "RECORDING",
        "Recording saved to Downloads folder.",
        5000,
      );
    };

    this.mediaRecorder.start();
    this.isRecording = true;
    this.drawFrame();
    this.infoBar.showDefault();
  }

  /**
   * Stops recording and triggers file download.
   */
  stop() {
    if (!this.isRecording || !this.mediaRecorder) return;

    this.mediaRecorder.stop();
    this.isRecording = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => {
        if (track.kind === "video") track.stop();
      });
      this.currentStream = null;
    }

    this.mediaRecorder = null;
    this.infoBar.showDefault();
    this.dialogShow(
      new Html("div").classOn("temp-dialog-text").text("RECORD STOPPED"),
      2000,
    );
  }

  /**
   * Pre-renders metadata canvas with song title and artist.
   * @private
   */
  _preRenderMeta() {
    if (!this.currentSongInfo) return;
    const w = this.outputResolution.width;
    const h = this.outputResolution.height;

    this.metaCanvas = document.createElement("canvas");
    this.metaCanvas.width = w;
    this.metaCanvas.height = h;
    const mCtx = this.metaCanvas.getContext("2d");

    const x = 50,
      y = 50,
      maxWidth = w * 0.4,
      padding = 25;
    const boxHeight = h * 0.11;

    mCtx.fillStyle = "rgba(0, 0, 0, 0.6)";
    mCtx.beginPath();
    mCtx.roundRect(
      x - padding,
      y - padding,
      maxWidth + padding * 2,
      boxHeight + padding,
      15,
    );
    mCtx.fill();

    mCtx.font = `bold ${Math.floor(h * 0.044)}px Rajdhani, sans-serif`;
    mCtx.fillStyle = "white";
    mCtx.textAlign = "left";
    mCtx.textBaseline = "top";
    mCtx.shadowColor = "black";
    mCtx.shadowBlur = 5;
    mCtx.fillText(this.currentSongInfo.title, x, y, maxWidth);

    mCtx.font = `${Math.floor(h * 0.03)}px Rajdhani, sans-serif`;
    mCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
    mCtx.shadowBlur = 0;
    mCtx.fillText(this.currentSongInfo.artist, x, y + h * 0.06, maxWidth);
  }

  /**
   * Gets or creates cached lyric layout for optimized rendering.
   * @private
   * @param {HTMLElement} element - The lyric line element
   * @param {number} h - Canvas height for responsive sizing
   * @param {boolean} isMidi - Whether rendering MIDI or LRC format
   * @returns {Object} Cached layout data for the lyric line
   */
  _getLyricCache(element, h, isMidi) {
    const firstChild = element.firstElementChild;
    let cache = this.lyricCaches.get(element);

    if (!cache || cache.firstChild !== firstChild || cache.h !== h) {
      const mainFontSize = Math.floor(h * 0.066);
      const subFontSize = Math.floor(h * 0.022);
      let layoutSyllables = [];
      let totalWidth = 0;
      let hasFurigana = false;
      let hasRomaji = false;

      this.oCtx.textBaseline = "bottom";

      if (isMidi) {
        this.oCtx.font = `bold ${mainFontSize}px "Radio Canada", sans-serif`;
        const spaceW = this.oCtx.measureText(" ").width * 0.6;

        const words = Array.from(element.querySelectorAll(".lyric-word"));
        for (let wIdx = 0; wIdx < words.length; wIdx++) {
          const syllableEls = Array.from(
            words[wIdx].querySelectorAll(".lyric-syllable-container"),
          );

          for (const container of syllableEls) {
            const origText =
              container
                .querySelector(".lyric-syllable-original")
                ?.textContent.replace(/\u00A0/g, "")
                .trim() || "";
            const romText =
              container
                .querySelector(".lyric-syllable-romanized")
                ?.textContent.replace(/\u00A0/g, "")
                .trim() || "";
            const furiText =
              container
                .querySelector(".lyric-syllable-furigana")
                ?.textContent.replace(/\u00A0/g, "")
                .trim() || "";

            if (furiText) hasFurigana = true;
            if (romText) hasRomaji = true;

            this.oCtx.font = `bold ${mainFontSize}px "Radio Canada", sans-serif`;
            const origW = origText ? this.oCtx.measureText(origText).width : 0;

            this.oCtx.font = `500 ${subFontSize}px "Radio Canada", sans-serif`;
            const romW = romText ? this.oCtx.measureText(romText).width : 0;
            const furiW = furiText ? this.oCtx.measureText(furiText).width : 0;

            const blockWidth =
              origW > 0 ? origW + h * 0.002 : Math.max(romW, furiW);

            layoutSyllables.push({
              domElement: container,
              origText,
              romText,
              furiText,
              origW,
              romW,
              furiW,
              width: blockWidth,
              addSpace: 0,
            });
            totalWidth += blockWidth;
          }
          if (wIdx < words.length - 1 && layoutSyllables.length > 0) {
            layoutSyllables[layoutSyllables.length - 1].addSpace = spaceW;
            totalWidth += spaceW;
          }
        }
      } else {
        const originalEl = element.querySelector(".lyric-line-original");
        const romanizedEl = element.querySelector(".lyric-line-romanized");
        const origText = originalEl ? originalEl.textContent : "";
        const romText = romanizedEl ? romanizedEl.textContent : "";

        hasRomaji = !!romText;
        hasFurigana = false;

        layoutSyllables = { origText, romText };
      }

      cache = {
        firstChild,
        h,
        syllables: layoutSyllables,
        totalWidth,
        mainFontSize,
        subFontSize,
        hasFurigana,
        hasRomaji,
      };
      this.lyricCaches.set(element, cache);
    }
    return cache;
  }

  /**
   * Renders a single frame to the recording canvas.
   * Handles background video, lyrics, countdown, score, and interlude overlays.
   */
  drawFrame() {
    if (!this.isRecording) return;
    const w = this.outputResolution.width;
    const h = this.outputResolution.height;

    const ctx = this.oCtx;

    const sourceVideo = this.bgvPlayer.videoElement;

    this.frameCounter++;
    if (this.frameCounter % 10 === 0) {
      const interludeEl = document.querySelector(".interlude-overlay");
      this.isInterludeVisible =
        interludeEl && interludeEl.classList.contains("visible");
      if (this.isInterludeVisible) {
        const tipEl = interludeEl.querySelector(".interlude-tip-box");
        this.cachedInterludeTip = tipEl ? tipEl.textContent : "";
      }
    }

    let targetBgvOpacity = 0;
    if (sourceVideo) {
      // Direct style property read is faster than getComputedStyle
      targetBgvOpacity = sourceVideo.style.opacity
        ? parseFloat(sourceVideo.style.opacity)
        : 1;
    }
    this.bgvCurrentOpacity +=
      (targetBgvOpacity - this.bgvCurrentOpacity) * 0.15;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    if (sourceVideo && sourceVideo.readyState >= 2 && !sourceVideo.paused) {
      this.bgvCtx.drawImage(sourceVideo, 0, 0, w, h);
    }

    if (this.bgvCurrentOpacity > 0.01) {
      ctx.globalAlpha = this.bgvCurrentOpacity;
      ctx.drawImage(this.bgvCanvas, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }

    this.lyricOpacity +=
      ((this.isInterludeVisible ? 0 : 1) - this.lyricOpacity) * 0.15;

    if (this.isInterludeVisible) {
      const iw = w * 0.6;
      const ih = h * 0.4;
      const ix = (w - iw) / 2;
      const iy = (h - ih) / 2;

      ctx.fillStyle = "rgba(10, 10, 20, 0.85)";
      ctx.beginPath();
      ctx.roundRect(ix, iy, iw, ih, 20);
      ctx.fill();

      ctx.strokeStyle = "#89CFF0";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.font = `900 ${Math.floor(h * 0.08)}px Rajdhani, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FFF";
      ctx.fillText("INTERLUDE", w / 2, iy + ih * 0.3);

      ctx.beginPath();
      ctx.moveTo(w / 2 - iw * 0.25, iy + ih * 0.45);
      ctx.lineTo(w / 2 + iw * 0.25, iy + ih * 0.45);
      ctx.strokeStyle = "rgba(137, 207, 240, 0.5)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = `500 ${Math.floor(h * 0.03)}px "Radio Canada", sans-serif`;
      ctx.fillStyle = "#FFD700";

      const maxTipWidth = iw * 0.85;
      const lineHeight = h * 0.04;
      const words = this.cachedInterludeTip.split(" ");
      let line = "";
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTipWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + " ";
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());

      const totalBlockHeight = (lines.length - 1) * lineHeight;
      let startY = iy + ih * 0.7 - totalBlockHeight / 2;

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], w / 2, startY + i * lineHeight);
      }
    }

    if (this.uiRefs && !this.uiRefs.playerUi.elm.classList.contains("hidden")) {
      if (this.lyricOpacity > 0.01) {
        ctx.globalAlpha = this.lyricOpacity;

        ctx.fillStyle = this.lyricGradient;
        ctx.fillRect(0, h * 0.4, w, h * 0.6);

        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        const isMidi =
          this.uiRefs.midiContainer &&
          this.uiRefs.midiContainer.elm.style.display === "flex";

        const line1El = isMidi
          ? this.uiRefs.midiLineDisplay1.elm
          : this.uiRefs.lrcLineDisplay1.elm;
        const line2El = isMidi
          ? this.uiRefs.midiLineDisplay2.elm
          : this.uiRefs.lrcLineDisplay2.elm;

        const cache1 = this._getLyricCache(line1El, h, isMidi);
        const cache2 = this._getLyricCache(line2El, h, isMidi);

        let line1Y = h * 0.72;
        let line2Y = h * 0.89;

        if (!cache1.hasRomaji && !cache2.hasFurigana) {
          line1Y = h * 0.76;
          line2Y = h * 0.88;
        }

        if (isMidi) {
          this.drawMidiLine(line1El, line1Y, h, cache1, ctx);
          this.drawMidiLine(line2El, line2Y, h, cache2, ctx);
        } else {
          this.drawLyricLine(line1El, line1Y, h, cache1, ctx);
          this.drawLyricLine(line2El, line2Y, h, cache2, ctx);
        }
        ctx.globalAlpha = 1.0;
      }

      if (
        this.uiRefs.scoreDisplay.elm.parentElement.classList.contains("visible")
      ) {
        const hudX = w * 0.04;
        const hudY = h * 0.92;

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        ctx.font = `bold ${Math.floor(h * 0.02)}px Rajdhani, sans-serif`;
        ctx.fillStyle = "#FFD700";
        ctx.fillText("SCORE", hudX, hudY);

        const scoreLabelWidth = ctx.measureText("SCORE").width;

        ctx.font = `bold ${Math.floor(h * 0.045)}px Rajdhani, sans-serif`;
        ctx.fillStyle = "#89CFF0";
        ctx.fillText(
          this.uiRefs.scoreDisplay.getText(),
          hudX + scoreLabelWidth + 10,
          hudY,
        );
      }

      const countdownEl =
        this.uiRefs.playerUi.elm.querySelector(".countdown-display");
      if (countdownEl && countdownEl.classList.contains("visible")) {
        const text = countdownEl.textContent;
        const cx = w / 2;
        const cy = h * 0.52;
        const radius = h * 0.08;

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.countdownGradient;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#4d4d4d";
        ctx.stroke();

        ctx.font = `900 ${Math.floor(h * 0.095)}px Rajdhani, sans-serif`;
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, cx, cy + h * 0.004);
      }
    }

    if (this.metaCanvas) {
      ctx.drawImage(this.metaCanvas, 0, 0);
    }

    this.ctx.drawImage(this.offscreenCanvas || this.canvas, 0, 0);

    this.animationFrameId = requestAnimationFrame(() => this.drawFrame());
  }

  /**
   * Renders a single LRC lyric line.
   * @param {HTMLElement} element - The lyric line element
   * @param {number} y - Y-coordinate for rendering
   * @param {number} h - Canvas height for responsive sizing
   * @param {Object} cache - Cached layout data
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawLyricLine(element, y, h, cache, ctx) {
    if (!cache.syllables.origText) return;

    const isActive = element.classList.contains("active");
    const defaultOpacity = element.classList.contains("next") ? 0.5 : 0.4;

    ctx.font = `bold ${cache.mainFontSize}px "Radio Canada", sans-serif`;
    ctx.fillStyle = isActive
      ? "#FFFFFF"
      : `rgba(255, 255, 255, ${defaultOpacity})`;

    if (isActive) {
      ctx.strokeStyle = "#010141";
      ctx.lineWidth = h * 0.01;
      ctx.lineJoin = "round";
      ctx.strokeText(
        cache.syllables.origText,
        this.outputResolution.width / 2,
        y,
      );
    }
    ctx.fillText(cache.syllables.origText, this.outputResolution.width / 2, y);

    if (cache.syllables.romText) {
      ctx.font = `500 ${cache.subFontSize}px "Radio Canada", sans-serif`;
      ctx.fillStyle = isActive
        ? "#FFFFFF"
        : `rgba(255, 255, 255, ${defaultOpacity + 0.1})`;

      if (isActive) {
        ctx.strokeStyle = "#010141";
        ctx.lineWidth = h * 0.005;
        ctx.lineJoin = "round";
        ctx.strokeText(
          cache.syllables.romText,
          this.outputResolution.width / 2,
          y + h * 0.05,
        );
      }
      ctx.fillText(
        cache.syllables.romText,
        this.outputResolution.width / 2,
        y + h * 0.05,
      );
    }
  }

  /**
   * Renders a single MIDI lyric line with syllable-by-syllable animation.
   * @param {HTMLElement} element - The lyric line element
   * @param {number} y - Y-coordinate for rendering
   * @param {number} h - Canvas height for responsive sizing
   * @param {Object} cache - Cached layout data
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  drawMidiLine(element, y, h, cache, ctx) {
    if (cache.syllables.length === 0) return;

    const isLineActive = element.classList.contains("active");
    const isLineNext = element.classList.contains("next");

    const mainFont = `bold ${cache.mainFontSize}px "Radio Canada", sans-serif`;
    const subFont = `500 ${cache.subFontSize}px "Radio Canada", sans-serif`;

    let currentX = (this.outputResolution.width - cache.totalWidth) / 2;

    for (const s of cache.syllables) {
      const centerX = currentX + s.width / 2;
      const isActive = s.domElement.classList.contains("active");
      const isCompleted = s.domElement.classList.contains("completed");

      let progress = 0;
      if (isCompleted) {
        progress = 1;
      } else if (isActive) {
        if (!s.wipeStartTime) {
          s.wipeStartTime = performance.now();
          const durStr = s.domElement.style.getPropertyValue(
            "--syllable-duration",
          );
          s.durationMs = (parseFloat(durStr) || 0.2) * 1000;
        }
        progress = Math.min(
          1,
          (performance.now() - s.wipeStartTime) / s.durationMs,
        );
      } else {
        s.wipeStartTime = null;
      }

      let drawColorDim = isLineNext
        ? "rgba(255, 255, 255, 0.5)"
        : isLineActive
          ? "rgba(255, 255, 255, 0.4)"
          : "rgba(255, 255, 255, 0.2)";

      if (s.furiText) {
        ctx.font = subFont;
        ctx.fillStyle = drawColorDim;
        ctx.fillText(s.furiText, centerX, y - h * 0.08);

        if (progress > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            centerX - s.furiW / 2,
            y - h * 0.12,
            s.furiW * progress,
            h * 0.06,
          );
          ctx.clip();

          ctx.strokeStyle = "#010141";
          ctx.lineWidth = h * 0.005;
          ctx.lineJoin = "round";
          ctx.strokeText(s.furiText, centerX, y - h * 0.08);

          ctx.fillStyle = "#ffb74d";
          ctx.fillText(s.furiText, centerX, y - h * 0.08);
          ctx.restore();
        }
      }

      if (s.romText) {
        ctx.font = subFont;
        ctx.fillStyle = drawColorDim;
        ctx.fillText(s.romText, centerX, y + h * 0.05);

        if (progress > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            centerX - s.romW / 2,
            y + h * 0.01,
            s.romW * progress,
            h * 0.06,
          );
          ctx.clip();

          ctx.strokeStyle = "#010141";
          ctx.lineWidth = h * 0.005;
          ctx.lineJoin = "round";
          ctx.strokeText(s.romText, centerX, y + h * 0.05);

          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(s.romText, centerX, y + h * 0.05);
          ctx.restore();
        }
      }

      if (s.origText) {
        ctx.font = mainFont;
        ctx.fillStyle = drawColorDim;
        ctx.fillText(s.origText, centerX, y);

        if (progress > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(
            centerX - s.origW / 2,
            y - h * 0.07,
            s.origW * progress,
            h * 0.09,
          );
          ctx.clip();

          ctx.strokeStyle = "#010141";
          ctx.lineWidth = h * 0.01;
          ctx.lineJoin = "round";
          ctx.strokeText(s.origText, centerX, y);

          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(s.origText, centerX, y);
          ctx.restore();
        }
      }

      currentX += s.width + s.addSpace;
    }
  }
}
