import CheckersScreen from "../views/CheckersScreen";
import GamesScreen from "../views/GamesScreen";
import UserLogin from "../views/UserLogin";
import UserRegister from "../views/UserRegister";

export const routeNames = Object.freeze({
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  GAMES_SCREEN: "GAMES_SCREEN",
  CHECKERS_SCREEN: "CHECKERS_SCREEN"
});

const routes = {
  [routeNames.LOGIN]: {
    name: routeNames.LOGIN,
    path: "/",
    component: UserLogin
  },
  [routeNames.REGISTER]: {
    name: routeNames.REGISTER,
    path: "/register",
    component: UserRegister
  },
  [routeNames.GAMES_SCREEN]: {
    name: routeNames.GAMES_SCREEN,
    path: "/games",
    component: GamesScreen
  },
  [routeNames.CHECKERS_SCREEN]: {
    name: routeNames.CHECKERS_SCREEN,
    path: "/checkers",
    component: CheckersScreen
  }
};

export default routes;
