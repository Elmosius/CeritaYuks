import { getAccessToken, getLogout } from "./utils/auth";
import { isCurrentPushSubscriptionAvailable, subscribe, unsubscribe } from "./utils/notification-helper";

export function setupNotificationButton() {
  const notifButton = document.querySelector("#notif-button");
  const notifIcon = notifButton?.querySelector("span");
  if (!notifButton || !notifIcon) return;

  const updateIcon = async () => {
    const subscribed = await isCurrentPushSubscriptionAvailable();
    if (subscribed) {
      notifIcon.classList.remove("mdi-bell");
      notifIcon.classList.add("mdi-bell-off");
    } else {
      notifIcon.classList.remove("mdi-bell-off");
      notifIcon.classList.add("mdi-bell");
    }
  };

  updateIcon();

  notifButton.addEventListener("click", async (event) => {
    event.preventDefault();

    try {
      const alreadySubscribed = await isCurrentPushSubscriptionAvailable();
      if (!alreadySubscribed) {
        await subscribe();
      } else {
        await unsubscribe();
      }
      updateIcon();
    } catch (error) {
      console.error("Notification button error:", error);
      alert("Terjadi kesalahan saat mengatur notifikasi.");
    }
  });
}

export function generateFullNav() {
  const isLogin = !!getAccessToken();

  return `
    <li><a href="#/">Lihat Cerita</a></li>
    <li><a href="#/create">Bagikan Cerita</a></li>
    ${
      isLogin
        ? `
    <li><a href="#/saved">Cerita yang disimpan</a></li>
    <li>
      <a href="#" id="notif-button" title="Push Notification">
            <span class="mdi mdi-bell"></span>
      </a>
    </li>
    <li><a href="#" id="logout-button" title="logout"><span class="mdi mdi-logout"></span></a></li>`
        : `<li><a href="#/login" title="login"><span class="mdi mdi-login"></span></a></li>`
    }
  `;
}

export function setupLogoutButton() {
  const logoutBtn = document.querySelector("#logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const result = window.confirm("Apakah Anda yakin ingin keluar?");
      if (!result) return;
      getLogout();
      location.hash = "/login";
    });
  }
}

export function showLoadingSpinner(container) {
  const spinnerHTML = `
    <div class="loading-spinner">
      <span class="loader"></span>
    </div>
  `;
  container.innerHTML = spinnerHTML;
}

export function hideLoadingSpinner(container) {
  container.innerHTML = "";
}
