import GuestPresenter from "./guest-presenter";
import { showFormattedDate } from "../../utils/index";

export default class GuestPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="login-title">Cerita dari Komunitas</h1>
        <div id="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new GuestPresenter({ view: this });
    this.#presenter.loadStories();
  }

  showStories(stories) {
    const container = document.getElementById("story-list");
    container.innerHTML = stories
      .map(
        (story) => `
        <article class="login-form-container" style="margin-bottom: 2rem;">
          <img src="${story.photoUrl}" alt="Cerita dari ${story.name}" style="max-width: 100%; border-radius: 8px;"/>
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <p><small>${showFormattedDate(story.createdAt, "id-ID")}</small></p>
        </article>
      `
      )
      .join("");
  }

  showError(message) {
    const container = document.getElementById("story-list");
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }
}
