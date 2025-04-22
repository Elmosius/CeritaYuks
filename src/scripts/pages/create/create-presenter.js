export default class CreatePresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async submitStory({ description, photo, latitude, longitude }) {
    if (!description || !photo) {
      this.#view.showMessage("Deskripsi dan foto wajib diisi!");
      return;
    }

    const isLogin = !!this.#authModel.getAccessToken();
    const apiFn = isLogin ? this.#model.addNewStory : this.#model.addNewStoryGuest;

    try {
      const result = await apiFn({ description, photo, latitude, longitude });

      if (!result.ok) {
        this.#view.showMessage(result.message || "Gagal mengirim cerita.");
        return;
      }

      this.#view.showMessage("Cerita berhasil dikirim!");
      location.hash = "/";
      this.#view.resetForm();
    } catch (error) {
      console.error("submitStory error:", error);
      this.#view.showMessage("Terjadi kesalahan saat mengirim cerita.");
    }
  }
}
