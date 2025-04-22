import RegisterPresenter from "./register-presenter";
import * as StoryAPI from "../../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="login-container">
        <article class="login-form-container">
          <h1 class="login-title">Daftar ke CeritaYuk!</h1>

          <form id="register-form" class="login-form">
            <div class="form-control">
              <label for="name-input">Nama</label>
              <input id="name-input" type="text" name="name" placeholder="Nama Lengkap" required autofocus>
            </div>

            <div class="form-control">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com" required>
            </div>

            <div class="form-control">
              <label for="password-input">Password</label>
              <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda" required>
            </div>

            <div class="form-buttons">
              <div id="submit-button-container">
                <button class="btn" type="submit">Daftar</button>
              </div>
              <p class="login-form-do-not-have-account">Sudah punya akun? <a href="#/login">Login</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: StoryAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById("register-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        name: document.getElementById("name-input").value,
        email: document.getElementById("email-input").value,
        password: document.getElementById("password-input").value,
      };

      await this.#presenter.doRegister(data);
    });
  }

  registerSuccessfully(message) {
    alert(`Registrasi berhasil! Silakan login.`);
    location.hash = "/login";
  }

  registerFailed(message) {
    alert(`Registrasi gagal: ${message}`);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn btn-with-loader" type="submit" disabled>
        <span class="loader-button"></span>
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn" type="submit">Daftar</button>
    `;
  }
}
