export default class StoryDetailPresenter {
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
  }

  async saveStoryDetail(story) {
    try {
      await this.#dbModel.put(story);
      alert("Cerita berhasil tersimpan");
    } catch (error) {
      console.error("saveStoryDetail error:", error);
      alert("Gagal menyimpan cerita.");
    }
  }

  async deleteStoryDetail(storyId) {
    try {
      await this.#dbModel.delete(storyId);
      alert("Cerita berhasil terhapus");
    } catch (error) {
      console.error("deleteStoryDetail error:", error);
      alert("Gagal menghapus cerita.");
    }
  }

  async loadStoryDetail(storyId) {
    try {
      const response = await this.#model.getStoryDetail(storyId);
      if (!response.ok) {
        console.error("Gagal memuat detail cerita");
        return;
      }

      const story = response.story;
      this.#view.displayStoryDetail(story);
    } catch (error) {
      console.error("loadStoryDetail error:", error);
    }
  }
}
