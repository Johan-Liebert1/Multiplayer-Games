import UserLogin from "../views/UserLogin";
import UserRegister from "../views/UserRegister";

const routes = [
  {
    name: "login",
    path: "/login",
    component: UserLogin
  },
  {
    name: "register",
    path: "/register",
    component: UserRegister
  }
];

export default routes;
