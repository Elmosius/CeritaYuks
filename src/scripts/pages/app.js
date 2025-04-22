import { getActiveRoute } from "../routes/url-parser";
import { routes } from "../routes/routes";
import { generateFullNav, setupLogoutButton, setupNotificationButton } from "../template";
import { setupSkipToContent } from "../utils";

class App {
  #content;
  #drawerButton;
  #navigationDrawer;
  #navbar;
  #skipLinkButton;

  constructor({ navigationDrawer, drawerButton, content, navbar, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navbar = navbar;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipLinkButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });

    window.addEventListener("scroll", () => {
      if (window.innerWidth > 992) {
        if (window.scrollY > 50) {
          this.#navbar.classList.add("scrolled");
        } else {
          this.#navbar.classList.remove("scrolled");
        }
      }
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url] || routes["*"];
    const page = route();

    const navList = document.querySelector("#nav-list");
    if (navList) {
      navList.innerHTML = generateFullNav();
      setupNotificationButton();
      setupLogoutButton();
    }

    if (document.startViewTransition) {
      const fadeOut = this.#content.animate(
        [
          { opacity: 1, transform: "translateY(0)" },
          { opacity: 0, transform: "translateY(14px)" },
        ],
        { duration: 100, fill: "forwards" }
      );

      fadeOut.onfinish = async () => {
        const transition = document.startViewTransition(async () => {
          this.#content.innerHTML = await page.render();
          await page.afterRender();

          window.scrollTo({ top: 0, behavior: "instant" });
        });

        transition.finished.finally(() => {
          this.#content.animate(
            [
              { opacity: 0, transform: "translateY(14px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 200, fill: "forwards" }
          );
        });
      };
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();

      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }
}

export default App;
