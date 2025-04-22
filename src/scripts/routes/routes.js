import HomePage from "../pages/home/home-page";
import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from "../utils/auth";
import CreatePage from "../pages/create/create-page";
import StoryDetailPage from "../pages/story-detail/storydetail-page";
import SavedPage from "../pages/saved/saved-page";
import NotFoundPage from "../pages/notfound/notfound-page";

export const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),

  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/create": () => new CreatePage(),
  "/saved": () => checkAuthenticatedRoute(new SavedPage()),
  "/s/:id": () => checkAuthenticatedRoute(new StoryDetailPage()),

  "*": () => new NotFoundPage(),
};

export default routes;
