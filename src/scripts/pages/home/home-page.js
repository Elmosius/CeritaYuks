import * as StoryAPI from "../../data/api";
import { hideLoadingSpinner, showLoadingSpinner } from "../../template";
import { showFormattedDate } from "../../utils";
import HomePresenter from "./home-presenter";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container home-section">
        <h1 class="home-title">Cerita yang Dibagikan</h1>
        <p class="home-desc">Di sini, semua orang bebas berbagi cerita, tanpa batas tempat, tanpa batas tema.</p>
        <div id="stories-list" class="stories-list"></div>
        <div id="loading"></div>
        <div id="pagination" class="pagination"></div>
      </section>
    `;
  }

  async afterRender() {
    const loading = document.getElementById("loading");

    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    showLoadingSpinner(loading);

    await this.#presenter.loadStories({ page: 1, size: 6, location: 1 });

    hideLoadingSpinner(loading);
  }

  async displayStories(stories) {
    const storiesList = document.getElementById("stories-list");

    const storiesHTML = stories.map((story) => {
      return `
        <div class="story-item">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-image" />
          <p class="story-description">${story.description}</p>
          <p class="story-name"><span class="mdi mdi-account"></span> <i>${story.name}</i></p>
          
           <p class="story-date"><span class="mdi mdi-calendar-range"></span> ${showFormattedDate(story.createdAt, "id-ID")}</p> 
          <button class="view-detail" data-id="${story.id}">Lihat Detail</button>
        </div>
      `;
    });

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

  displayPagination(page, hasNextPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = `
      <button ${page === 1 ? "disabled" : ""} id="prev-page">Previous</button>
      <span>Page ${page}</span>
      <button ${!hasNextPage ? "disabled" : ""} id="next-page">Next</button>
    `;

    document.getElementById("prev-page").addEventListener("click", async () => {
      await this.#presenter.loadStories({ page: page - 1 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.getElementById("next-page").addEventListener("click", async () => {
      await this.#presenter.loadStories({ page: page + 1 });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
