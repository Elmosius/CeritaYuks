export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories({ page = 1, size = 6, location = 1 }) {
    try {
      const response = await this.#model.getAllStories({ page, size, location });

      if (!response.ok) {
        throw new Error("Gagal memuat cerita");
      }

      const stories = response.listStory;

      const hasNextPage = stories.length === size;

      this.#view.displayStories(stories);
      this.#view.displayPagination(page, hasNextPage, stories.length);
    } catch (error) {
      console.error("loadStories error:", error);
    }
  }
}
