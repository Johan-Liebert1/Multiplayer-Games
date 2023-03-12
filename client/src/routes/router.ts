import CheckersPlayBoard from "../components/checkers/CheckersPlayBoard";
import CheckersTestBoard from "../components/checkers/CheckersTest";
import ChessPlayBoard from "../components/chess/ChessPlayBoard";
import ChessBoardTest from "../components/chess/ChessTest";
import TestComponent from "../components/test";
import CheckersScreen from "../views/CheckersScreen";
import ChessScreen from "../views/ChessScreen";
import GamesScreen from "../views/GamesScreen";
import SketchIOScreen from "../views/SketchIOScreen";
import Statistics from "../views/Statistics";
import UserLogin from "../views/UserLogin";
import UserProfileScreen from "../views/UserProfileScreen";
import UserRegister from "../views/UserRegister";

export const routeNames = Object.freeze({
    LOGIN: "LOGIN",
    REGISTER: "REGISTER",
    PROFILE: "PROFILE",
    STATISTICS: "STATISTICS",
    GAMES_SCREEN: "GAMES_SCREEN",
    CHECKERS_SCREEN: "CHECKERS_SCREEN",
    CHESS_SCREEN: "CHESS_SCREEN",
    SKETCHIO_SCREEN: "SKETCHIO_SCREEN",
    CHECKERS_TEST: "CHECKERS_TEST",
    CHESS_TEST: "CHESS_TEST",
    CHESS_PLAY: "CHESS_PLAY",
    CHECKERS_PLAY: "CHECKERS_PLAY",
});

const routes = {
    [routeNames.LOGIN]: {
        name: routeNames.LOGIN,
        path: "/",
        component: UserLogin,
    },
    [routeNames.REGISTER]: {
        name: routeNames.REGISTER,
        path: "/register",
        component: UserRegister,
    },
    [routeNames.GAMES_SCREEN]: {
        name: routeNames.GAMES_SCREEN,
        path: "/games",
        component: GamesScreen,
    },
    [routeNames.CHESS_TEST]: {
        name: "chessTest",
        path: "/chess/analyze",
        component: ChessBoardTest,
    },
    [routeNames.CHESS_PLAY]: {
        name: "CHESS_PLAY",
        path: "/chess/test",
        component: ChessPlayBoard,
    },
    [routeNames.CHECKERS_PLAY]: {
        name: "CHESSCHECKERS_PLAY_PLAY",
        path: "/checkers/test",
        component: CheckersPlayBoard,
    },
    [routeNames.CHECKERS_SCREEN]: {
        name: routeNames.CHECKERS_SCREEN,
        path: "/checkers/:roomId",
        component: CheckersScreen,
    },
    [routeNames.CHESS_SCREEN]: {
        name: routeNames.CHESS_SCREEN,
        path: "/chess/:roomId",
        component: ChessScreen,
    },
    [routeNames.SKETCHIO_SCREEN]: {
        name: routeNames.SKETCHIO_SCREEN,
        path: "/sketchio/:roomId",
        component: SketchIOScreen,
    },
    [routeNames.CHECKERS_TEST]: {
        name: "checkersTest",
        path: "/checkerstest",
        component: CheckersTestBoard,
    },
    [routeNames.PROFILE]: {
        name: "profile",
        path: "/profile",
        component: UserProfileScreen,
    },
    [routeNames.STATISTICS]: {
        name: "stats",
        path: "/stats",
        component: Statistics,
    },
    '/test': {
        name: "test",
        path: "/test",
        component: TestComponent,
    }
};

export default routes;
