import { getAllStories } from "../../data/api";

export default class GuestPresenter {
  #view;

  constructor({ view }) {
    this.#view = view;
  }

  async loadStories() {
    try {
      const response = await getAllStories();
      if (!response.ok) throw new Error(response.message);
      this.#view.showStories(response.listStory);
    } catch (error) {
      console.error("loadStories error:", error);
      this.#view.showError(error.message || "Gagal memuat cerita.");
    }
  }
}
