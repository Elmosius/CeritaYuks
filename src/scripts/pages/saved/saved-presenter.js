export default class SavedPresenter {
  #view;
  #dbModel;

  constructor({ view, dbModel }) {
    this.#view = view;
    this.#dbModel = dbModel;
  }

  async loadSavedStories() {
    try {
      const stories = await this.#dbModel.getAll();
      this.#view.displayStories(stories);
    } catch (error) {
      console.error("loadSavedStories error:", error);
      this.#view.displayStories([]);
    }
  }
}
