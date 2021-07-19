import GamesScreen from "../views/GamesScreen";
import UserLogin from "../views/UserLogin";
import UserRegister from "../views/UserRegister";

const routes = [
  {
    name: "login",
    path: "/",
    component: UserLogin
  },
  {
    name: "register",
    path: "/register",
    component: UserRegister
  },
  {
    name: "games-screen",
    path: "/games",
    component: GamesScreen
  }
];

export default routes;
