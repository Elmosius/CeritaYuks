import StoryDB from "../../data/database";
import Map from "../../utils/map";
import SavedPresenter from "./saved-presenter";
import { showFormattedDate } from "../../utils";

export default class SavedPage {
  #presenter = null;

  async render() {
    return `
      <section class="container home-section">
        <h1 class="home-title">Cerita Tersimpan</h1>
        <div id="stories-list" class="stories-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new SavedPresenter({
      view: this,
      dbModel: StoryDB,
    });

    await this.#presenter.loadSavedStories();
  }

  async displayStories(stories) {
    const storiesList = document.getElementById("stories-list");

    if (!stories.length) {
      storiesList.innerHTML = "<p>Belum ada cerita yang disimpan.</p>";
      return;
    }

    const storiesHTML = await Promise.all(
      stories.map(async (story) => {
        let locationText = "Lokasi tidak tersedia";
        if (story.lat && story.lon) {
          locationText = await Map.getPlaceNameByCoordinate(story.lat, story.lon);
        }

        return `
          <div class="story-item">
            <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
            <p class="story-description">${story.description}</p>
            <p class="story-name"><span class="mdi mdi-account"></span> <i>${story.name}</i></p>
            <p class="story-date"><span class="mdi mdi-calendar-range"></span> ${showFormattedDate(story.createdAt, "id-ID")}</p> 
            <button class="view-detail" data-id="${story.id}">Lihat Detail</button>
          </div>
        `;
      })
    );

    storiesList.innerHTML = storiesHTML.join("");

    this.#addDetailButtonListeners();
  }

  #addDetailButtonListeners() {
    const detailButtons = document.querySelectorAll(".view-detail");
    detailButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        const storyId = event.target.dataset.id;
        location.hash = `/s/${storyId}`;
      });
    });
  }
}
