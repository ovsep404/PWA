document.addEventListener("DOMContentLoaded", () => {
  console.log("PWA is running!");

  const notifyBtn = document.getElementById("notifyBtn");
  const vibrateBtn = document.getElementById("vibrateBtn");
  const geoBtn = document.getElementById("geoBtn");
  const batteryBtn = document.getElementById("batteryBtn");
  const shareBtn = document.getElementById("shareBtn");
  const memoryBtn = document.getElementById("memoryBtn");

  const networkBtn = document.getElementById("networkBtn");

  const clipboardBtn = document.getElementById("clipboardBtn");

  const cameraBtn = document.getElementById("cameraBtn");
  const videoElement = document.getElementById("videoElement");
  const canvas = document.getElementById("canvas");

  notifyBtn.addEventListener("click", () => {
    showNotification("Hello from PWA!");
  });

  vibrateBtn.addEventListener("click", () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    } else {
      console.log("Vibration not supported");
    }
  });

  geoBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
        showNotification(coords);
      });
    }
  });

  batteryBtn.addEventListener("click", async () => {
    if ("getBattery" in navigator) {
      const battery = await navigator.getBattery();
      showNotification(`Battery Level: ${battery.level * 100}%`);
    }
  });

  shareBtn.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My PWA",
          text: "Check out this PWA!",
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  });

  memoryBtn.addEventListener("click", () => {
    if ("deviceMemory" in navigator) {
      showNotification(`Device Memory: ${navigator.deviceMemory} GB`);
    }
  });

  cameraBtn.addEventListener("click", async () => {
    if (
      "mediaDevices" in navigator &&
      "getUserMedia" in navigator.mediaDevices
    ) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // This ensures front camera on mobile
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        videoElement.srcObject = stream;
        videoElement.style.display = "block";

        // Start playing the video
        videoElement.play();

        // Take photo after 3 seconds
        setTimeout(() => {
          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;
          canvas.getContext("2d").drawImage(videoElement, 0, 0);

          // Stop camera
          stream.getTracks().forEach((track) => track.stop());
          videoElement.style.display = "none";

          showNotification("Photo captured!");
        }, 10000);
      } catch (err) {
        console.error("Camera access failed:", err);
        showNotification("Camera access failed");
      }
    } else {
      showNotification("Camera not supported");
    }
  });

  networkBtn.addEventListener("click", () => {
    if ("connection" in navigator) {
      const connection = navigator.connection;
      const speed = `Type: ${connection.effectiveType}, Speed: ${connection.downlink} Mbps`;
      showNotification(speed);
    }
  });

  clipboardBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("Hello from PWA!");
      showNotification("Text copied to clipboard");
    } catch (err) {
      showNotification("Clipboard access failed");
    }
  });

  // Check if the browser supports notifications
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    });
  }

  // Online/Offline status handling
  window.addEventListener("online", () => {
    console.log("Application is online");
    showNotification("You are online");
  });

  window.addEventListener("offline", () => {
    console.log("Application is offline");
    showNotification("You are offline");
  });
});

function showNotification(message) {
  if (
    "serviceWorker" in navigator &&
    "Notification" in window &&
    Notification.permission === "granted"
  ) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification("PWA Status", {
        body: message,
        icon: "icons/icon.png",
      });
    });
  }
}
