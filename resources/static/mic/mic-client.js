// mic-client.js

document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status");
  const connectBtn = document.getElementById("connectBtn");

  let peer = null;
  let currentCall = null;
  let localStream = null;

  // 1. Get connection details from URL
  const params = new URLSearchParams(window.location.search);
  const targetPeerId = params.get("peerId");
  const sessionCode = params.get("code");

  if (!targetPeerId || !sessionCode) {
    updateStatus("Error: Invalid or missing connection link.", true);
    connectBtn.disabled = true;
    return;
  }

  // 2. Main connect logic
  const connectMic = async () => {
    connectBtn.disabled = true;
    updateStatus("Requesting microphone access...");

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        channelCount: 1,
        sampleRate: 48000,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        latency: 0.01,
      });
    } catch (err) {
      updateStatus("Error: Microphone access denied.", true);
      console.error("getUserMedia error:", err);
      connectBtn.disabled = false;
      return;
    }

    updateStatus("Initializing connection...");
    peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
          { urls: "stun:stun2.l.google.com:19302" },
        ],
        turnServers: [],
      },
    });

    peer.on("open", (id) => {
      console.log("My PeerJS ID is:", id);
      updateStatus(`Connecting to Encore...`);

      const call = peer.call(targetPeerId, localStream, {
        metadata: { code: sessionCode },
        sdpTransform: (sdp) => {
          return sdp.replace(
            /a=fmtp:\d+.*\r\n/g,
            "a=fmtp:111 minptime=10; useinbandfec=0; stereo=0; maxaveragebitrate=128000\r\n",
          );
        },
      });
      currentCall = call;

      call.on("stream", () => {
        // This is for receiving audio back, which we don't do.
        // But the event confirms the connection is fully established.
        console.log("Connection established, streaming audio.");
        updateStatus("Connected! You can now sing.", false, true);
        setupDisconnectButton();
      });

      call.on("close", () => {
        handleDisconnect("Connection closed by Encore.");
      });
    });

    peer.on("error", (err) => {
      console.error("PeerJS error:", err);
      handleDisconnect(`Connection error: ${err.type}`);
    });
  };

  // 3. UI and State Management
  const handleDisconnect = (message) => {
    if (currentCall) {
      currentCall.close();
      currentCall = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      localStream = null;
    }
    if (peer) {
      peer.destroy();
      peer = null;
    }
    updateStatus(message, true);
    setupConnectButton();
  };

  const setupConnectButton = () => {
    connectBtn.textContent = "Connect Microphone";
    connectBtn.className = "";
    connectBtn.onclick = connectMic;
    connectBtn.disabled = false;
  };

  const setupDisconnectButton = () => {
    connectBtn.textContent = "Disconnect";
    connectBtn.className = "disconnect";
    connectBtn.onclick = () => handleDisconnect("Disconnected by user.");
    connectBtn.disabled = false;
  };

  const updateStatus = (message, isError = false, isSuccess = false) => {
    statusEl.textContent = message;
    statusEl.style.color = isError ? "#e53935" : isSuccess ? "#4caf50" : "#aaa";
  };

  // 4. Initial Setup
  connectBtn.addEventListener("click", connectMic);
});
