class PWANavigator {
  constructor() {
    this.videoElement = document.getElementById("videoElement");
    this.canvas = document.getElementById("canvas");
    this.initNotifications();
  }

  initNotifications() {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        }
      });
    }
  }

  notifyBtn() {
    document.getElementById("notifyBtn").addEventListener("click", () => {
      this.showNotification("Hello from PWA!");
    });
  }

  vibrateBtn() {
    document.getElementById("vibrateBtn").addEventListener("click", () => {
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      } else {
        console.log("Vibration not supported");
      }
    });
  }

  geoBtn() {
    document.getElementById("geoBtn").addEventListener("click", () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          const coords = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
          this.showNotification(coords);
        });
      }
    });
  }

  batteryBtn() {
    document
      .getElementById("batteryBtn")
      .addEventListener("click", async () => {
        if ("getBattery" in navigator) {
          const battery = await navigator.getBattery();
          this.showNotification(`Battery Level: ${battery.level * 100}%`);
        }
      });
  }

  shareBtn() {
    document.getElementById("shareBtn").addEventListener("click", async () => {
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
  }

  memoryBtn() {
    document.getElementById("memoryBtn").addEventListener("click", () => {
      if ("deviceMemory" in navigator) {
        this.showNotification(`Device Memory: ${navigator.deviceMemory} GB`);
      }
    });
  }

  networkBtn() {
    document.getElementById("networkBtn").addEventListener("click", () => {
      if ("connection" in navigator) {
        const connection = navigator.connection;
        const speed = `Type: ${connection.effectiveType}, Speed: ${connection.downlink} Mbps`;
        this.showNotification(speed);
      }
    });
  }

  clipboardBtn() {
    document
      .getElementById("clipboardBtn")
      .addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText("Hello from PWA!");
          this.showNotification("Text copied to clipboard");
        } catch (err) {
          this.showNotification("Clipboard access failed");
        }
      });
  }

  cameraBtn() {
    document.getElementById("cameraBtn").addEventListener("click", async () => {
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

          this.videoElement.srcObject = stream;
          this.videoElement.style.display = "block";

          // Start playing the video
          this.videoElement.play();

          // Take photo after 3 seconds
          setTimeout(() => {
            this.canvas.width = this.videoElement.videoWidth;
            this.canvas.height = this.videoElement.videoHeight;
            this.canvas.getContext("2d").drawImage(this.videoElement, 0, 0);

            // Stop camera
            stream.getTracks().forEach((track) => track.stop());
            this.videoElement.style.display = "none";

            this.showNotification("Photo captured!");
          }, 10000);
        } catch (err) {
          console.error("Camera access failed:", err);
          this.showNotification("Camera access failed");
        }
      } else {
        this.showNotification("Camera not supported");
      }
    });
  }

  // Online/Offline status handling
  online() {
    window.addEventListener("online", () => {
      console.log("Application is online");
      this.showNotification("You are online");
    });
  }

  offline() {
    window.addEventListener("offline", () => {
      console.log("Application is offline");
      this.showNotification("You are offline");
    });
  }

  showNotification(message) {
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

  // Initialize all PWA features
  init() {
    this.notifyBtn();
    this.vibrateBtn();
    this.geoBtn();
    this.batteryBtn();
    this.shareBtn();
    this.memoryBtn();
    this.networkBtn();
    this.clipboardBtn();
    this.cameraBtn();
    this.online();
    this.offline();
  }
}

export default PWANavigator;
