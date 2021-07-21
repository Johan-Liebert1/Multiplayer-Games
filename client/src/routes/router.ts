import CheckersScreen from "../views/CheckersScreen";
import ChessScreen from "../views/ChessScreen";
import GamesScreen from "../views/GamesScreen";
import SketchIOScreen from "../views/SketchIOScreen";
import UserLogin from "../views/UserLogin";
import UserRegister from "../views/UserRegister";

export const routeNames = Object.freeze({
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  GAMES_SCREEN: "GAMES_SCREEN",
  CHECKERS_SCREEN: "CHECKERS_SCREEN",
  CHESS_SCREEN: "CHESS_SCREEN",
  SKETCHIO_SCREEN: "SKETCHIO_SCREEN"
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
  },
  [routeNames.CHESS_SCREEN]: {
    name: routeNames.CHESS_SCREEN,
    path: "/chess",
    component: ChessScreen
  },
  [routeNames.SKETCHIO_SCREEN]: {
    name: routeNames.SKETCHIO_SCREEN,
    path: "/sketchio",
    component: SketchIOScreen
  }
};

export default routes;
