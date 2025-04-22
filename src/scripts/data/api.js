import CONFIG from "../config";
import { getAccessToken } from "../utils/auth";

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`, // POST
  LOGIN: `${CONFIG.BASE_URL}/login`, // POST

  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`, // POST

  ADD_NEW_STORY_GUEST: `${CONFIG.BASE_URL}/stories/guest`, // POST

  GET_ALL_STORIES: `${CONFIG.BASE_URL}/stories`, // GET
  GET_STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`, // GET

  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`, // POST
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`, // DELETE
};

export async function register({ name, email, password }) {
  const data = JSON.stringify({ name, email, password });

  const fetchResponse = await fetch(ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function login({ email, password }) {
  const data = JSON.stringify({ email, password });

  const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getAllStories({ page = 1, size = 10, location = 0 }) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(`${ENDPOINTS.GET_ALL_STORIES}?page=${page}&size=${size}&location=${location}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function getStoryDetail(id) {
  const accessToken = getAccessToken();

  const fetchResponse = await fetch(ENDPOINTS.GET_STORY_DETAIL(id), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function addNewStory({ description, photo, latitude, longitude }) {
  const accessToken = getAccessToken();

  if (photo && photo.size > 1048576) {
    return {
      error: true,
      message: "File size exceeds 1MB limit.",
    };
  }

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (latitude) formData.append("lat", latitude);
  if (longitude) formData.append("lon", longitude);

  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function addNewStoryGuest({ description, photo, latitude, longitude }) {
  if (photo && photo.size > 1048576) {
    return {
      error: true,
      message: "File size exceeds 1MB limit.",
    };
  }

  const formData = new FormData();
  formData.append("description", description);
  formData.append("photo", photo);
  if (latitude) formData.append("lat", latitude);
  if (longitude) formData.append("lon", longitude);

  const fetchResponse = await fetch(ENDPOINTS.ADD_NEW_STORY_GUEST, {
    method: "POST",
    body: formData,
  });

  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}
