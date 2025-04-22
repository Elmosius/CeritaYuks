// sw.js
import { precacheAndRoute } from "workbox-precaching";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("push", (event) => {
  console.log("Service worker pushing...");

  let notificationTitle = "CeritaYuk";
  let notificationOptions = {
    body: "Ada sesuatu yang baru!",
    icon: "/favicon.png",
    badge: "/favicon.png",
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      notificationTitle = payload.title || notificationTitle;
      notificationOptions = {
        ...notificationOptions,
        ...payload.options,
      };
    } catch (e) {
      console.error("Gagal parsing data push notification:", e);
    }
  }

  event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
});
