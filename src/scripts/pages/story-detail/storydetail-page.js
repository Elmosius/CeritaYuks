import * as StoryAPI from "../../data/api";
import { hideLoadingSpinner, showLoadingSpinner } from "../../template";
import { showFormattedDate } from "../../utils";
import Map from "../../utils/map";
import StoryDB from "../../data/database";
import StoryDetailPresenter from "./storydetail-presenter";

export default class StoryDetailPage {
  #presenter = null;
  #currentStory = null;

  async render() {
    return `
      <section class="container story-detail-section">
        <div id="loading"></div>
        <div id="story-detail-content"></div>
        <div id="map"></div>
        <p id="coordinates" style="text-align: center; margin-top: 1rem;"></p>
        <button id="back-button">Kembali</button>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter({
      view: this,
      model: StoryAPI,
      dbModel: StoryDB,
    });

    const loading = document.getElementById("loading");

    showLoadingSpinner(loading);

    const storyId = this.#getStoryIdFromRoute();
    await this.#presenter.loadStoryDetail(storyId);

    hideLoadingSpinner(loading);

    document.getElementById("back-button").addEventListener("click", () => {
      window.location.hash = "/";
    });
  }

  #getStoryIdFromRoute() {
    return location.hash.split("/")[2];
  }

  async displayStoryDetail(story) {
    this.#currentStory = story;

    const storyDetailContent = document.getElementById("story-detail-content");

    const location = await Map.getPlaceNameByCoordinate(story.lat, story.lon);

    const isAlreadySaved = await StoryDB.get(story.id);
    const saveButtonHTML = `
    <button id="save-story-button">
      ${isAlreadySaved ? "Hapus Cerita dari Simpanan" : "Simpan Cerita"}
    </button>
`;

    storyDetailContent.innerHTML = `
      <img src="${story.photoUrl}" alt="${story.name}" class="story-image-detail" />
      <h2>${story.description}</h2>
      <p><span class="mdi mdi-map-marker"></span> ${location}</p>
      <p><span class="mdi mdi-calendar-range"></span> ${showFormattedDate(story.createdAt, "id-ID")}</p> 
      <p><span class="mdi mdi-account"></span><i> ${story.name}</i></p>
      ${saveButtonHTML}
    `;

    this.displayMap(story.lat, story.lon);

    const coordinates = document.getElementById("coordinates");
    coordinates.innerHTML = `
      <strong>Latitude:</strong> ${story.lat} 
      <strong>Longitude:</strong> ${story.lon}
    `;

    const saveButton = document.getElementById("save-story-button");
    if (saveButton) {
      saveButton.addEventListener("click", async () => {
        const isSaved = await StoryDB.get(this.#currentStory.id);

        if (isSaved) {
          await this.#presenter.deleteStoryDetail(this.#currentStory.id);
          saveButton.innerText = "Simpan Cerita";
        } else {
          await this.#presenter.saveStoryDetail(this.#currentStory);
          saveButton.innerText = "Hapus Cerita";
        }
      });
    }
  }

  displayMap(latitude, longitude) {
    Map.build("#map", {
      center: [latitude, longitude],
      zoom: 13,
      locate: false,
    }).then((map) => {
      Map.getPlaceNameByCoordinate(latitude, longitude).then((location) => {
        map.addMarker(
          [latitude, longitude],
          {},
          {
            content: location,
          }
        );
      });
    });
  }
}
