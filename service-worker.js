const CACHE_NAME = "pwa-v1";
const urlsToCache = ["./", "./index.html", "./main.js", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Add push notification handler
self.addEventListener("push", (event) => {
  const options = {
    body: event.data.text(),
    icon: "icons/icon.png",
    badge: "icons/icon.png",
  };

  event.waitUntil(
    self.registration.showNotification("PWA Notification", options)
  );
});
