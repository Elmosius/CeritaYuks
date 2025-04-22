export default class RegisterPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async doRegister({ name, email, password }) {
    this.#view.showSubmitLoadingButton();

    try {
      const response = await this.#model.register({ name, email, password });

      if (!response.ok) {
        this.#view.registerFailed(response.message);
        return;
      }

      this.#view.registerSuccessfully(response.message);
    } catch (error) {
      console.error("doRegister: error:", error);
      this.#view.registerFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
