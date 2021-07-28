import CheckersTestBoard from "../components/checkers/CheckersTest";
import ChessBoardTest from "../components/chess/ChessTest";
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
  SKETCHIO_SCREEN: "SKETCHIO_SCREEN",
  CHECKERS_TEST: "CHECKERS_TEST",
  CHESS_TEST: "CHESS_TEST"
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
    path: "/checkers/:roomId",
    component: CheckersScreen
  },
  [routeNames.CHESS_SCREEN]: {
    name: routeNames.CHESS_SCREEN,
    path: "/chess/:roomId",
    component: ChessScreen
  },
  [routeNames.SKETCHIO_SCREEN]: {
    name: routeNames.SKETCHIO_SCREEN,
    path: "/sketchio/:roomId",
    component: SketchIOScreen
  },
  [routeNames.CHECKERS_TEST]: {
    name: "checkersTest",
    path: "/checkerstest",
    component: CheckersTestBoard
  },
  [routeNames.CHESS_TEST]: {
    name: "chessTest",
    path: "/chesstest",
    component: ChessBoardTest
  }
};

export default routes;
