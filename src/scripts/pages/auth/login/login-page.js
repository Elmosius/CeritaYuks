import LoginPresenter from "./login-presenter";
import * as StoryAPI from "../../../data/api";
import * as AuthModel from "../../../utils/auth";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="login-container">
        <article class="login-form-container">
          <h1 class="login-title">Login ke Platform CeritaYuk!</h1>

          <form id="login-form" class="login-form">
            <div class="form-control">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com" required autofocus>
            </div>

            <div class="form-control">
              <label for="password-input">Password</label>
              <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda" required autofocus>
            </div>

            <div class="form-buttons">
              <div id="submit-button-container">
              
                <button class="btn" type="submit">Masuk</button>
              </div>
              <p class="login-form-do-not-have-account">Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: StoryAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document.getElementById("login-form").addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        email: document.getElementById("email-input").value,
        password: document.getElementById("password-input").value,
      };

      await this.#presenter.getLogin(data);
    });
  }

  loginSuccessfully(message, data) {
    console.log("Login success:", message, data);
    location.hash = "/";
  }

  loginFailed(message) {
    alert(`Login gagal: ${message}`);
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
      <button class="btn" type="submit">Masuk</button>
    `;
  }
}
