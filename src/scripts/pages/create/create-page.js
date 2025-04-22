import CreatePresenter from "./create-presenter";
import * as StoryAPI from "../../data/api";
import * as AuthModel from "../../utils/auth";
import Camera from "../../utils/camera";
import Map from "../../utils/map";
import { hideLoadingSpinner, showLoadingSpinner } from "../../template";

export default class CreatePage {
  #presenter;
  #camera;
  #map;
  #marker;
  #photo = null;

  async render() {
    return `
        <section class="container create-section">
          <h2>Bagikan Ceritamu!</h2>
          <form id="create-form">
            <div class="form-control">
              <label for="description-input">Deskripsi Cerita</label>
              <textarea id="description-input" rows="4" required></textarea>
            </div>

            <div class="form-control">
              <label for="photo-input">Unggah Gambar dari File (maks. 1MB)</label>
              <input type="file" id="photo-input" accept="image/*" />
            </div>
  
            <div class="form-control">
              <label for="camera-section">Atau Gunakan Kamera</label>
              <button type="button" id="start-camera-button">Buka Kamera</button>
              <button type="button" id="stop-camera-button" style="display:none;">Tutup Kamera</button>
              <div id="camera-section" style="display:none;">
                <video id="video" autoplay muted playsinline></video>
                <select id="camera-select"></select>
                <canvas id="canvas" style="display:none;"></canvas>
                <button type="button" id="take-picture-button">Ambil Foto</button>
              </div>
              <div id="photo-preview-container" style="margin-top: 1rem;"></div>
            </div>
  
            <div class="form-control">
              <label for="map">Pilih Lokasi (opsional)</label>
              <div id="loading"></div>
              <div id="map" style="height: 300px;"></div>
              <div class="map-coordinates">
                <label for="latitude-input">Latitude:</label>
                <input type="number" id="latitude-input" name="latitude" step="any" disabled>
                <label for="longitude-input">Longitude:</label>
                <input type="number" id="longitude-input" name="longitude" step="any" disabled>
              </div>
            </div>
  
            <button type="submit" class="btn">Kirim Cerita</button>
          </form>
        </section>
      `;
  }

  async afterRender() {
    this.#presenter = new CreatePresenter({ view: this, model: StoryAPI, authModel: AuthModel });

    const startBtn = document.getElementById("start-camera-button");
    const stopBtn = document.getElementById("stop-camera-button");
    const cameraSection = document.getElementById("camera-section");
    const photoInput = document.getElementById("photo-input");

    this.#camera = new Camera({
      video: document.getElementById("video"),
      cameraSelect: document.getElementById("camera-select"),
      canvas: document.getElementById("canvas"),
    });

    startBtn.addEventListener("click", async () => {
      cameraSection.style.display = "block";
      stopBtn.style.display = "inline-block";
      startBtn.style.display = "none";
      await this.#camera.launch();
    });

    stopBtn.addEventListener("click", () => {
      cameraSection.style.display = "none";
      stopBtn.style.display = "none";
      startBtn.style.display = "inline-block";
      this.#camera.stop();
    });

    document.getElementById("take-picture-button").addEventListener("click", async () => {
      this.#photo = await this.#camera.takePicture();
      this.#previewImage(this.#photo);
    });

    photoInput.addEventListener("change", () => {
      const file = photoInput.files[0];
      if (file) {
        if (file.size > 1048576) {
          alert("Ukuran gambar maksimal 1MB ya!");
          photoInput.value = "";
          return;
        }

        this.#photo = file;
        this.#previewImage(file);
      }
    });

    const loading = document.getElementById("loading");
    showLoadingSpinner(loading);

    this.#map = await Map.build("#map", { locate: true, zoom: 12 });

    hideLoadingSpinner(loading);

    const center = this.#map.getCenter();
    this.#updateLatLonInputs(center.latitude, center.longitude);

    const location = await Map.getPlaceNameByCoordinate(center.latitude, center.longitude);

    this.#marker = this.#map.addMarker(
      [center.latitude, center.longitude],
      { draggable: true },
      {
        content: location,
      }
    );

    this.#marker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLonInputs(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", async (event) => {
      const { lat, lng } = event.latlng;
      this.#marker.setLatLng([lat, lng]);
      this.#map.changeCamera([lat, lng], 14);
      this.#updateLatLonInputs(lat, lng);

      const clickedLocation = await Map.getPlaceNameByCoordinate(lat, lng);
      this.#marker.bindPopup(clickedLocation).openPopup();
    });

    document.getElementById("create-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.getElementById("description-input").value;
      const latitude = parseFloat(document.getElementById("latitude-input").value);
      const longitude = parseFloat(document.getElementById("longitude-input").value);

      await this.#presenter.submitStory({ description, photo: this.#photo, latitude, longitude });
    });
  }

  #updateLatLonInputs(lat, lon) {
    document.getElementById("latitude-input").value = lat.toFixed(6);
    document.getElementById("longitude-input").value = lon.toFixed(6);
  }

  #previewImage(file) {
    const previewContainer = document.getElementById("photo-preview-container");
    const reader = new FileReader();
    reader.onload = (e) => {
      previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview Foto" style="max-width: 300px; border: 1px solid #ccc;" />`;
    };
    reader.readAsDataURL(file);
  }

  showMessage(message) {
    alert(message);
  }

  resetForm() {
    document.getElementById("create-form").reset();
    document.getElementById("photo-preview-container").innerHTML = "";
    document.getElementById("latitude-input").value = "";
    document.getElementById("longitude-input").value = "";
    this.#photo = null;
    if (this.#marker) {
      this.#marker.remove();
      this.#marker = null;
    }
  }
}
