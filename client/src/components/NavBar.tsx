import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { RouteProps } from "../types/routeProps";
import ProfilePic from "./user/ProfilePic";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { ListItem } from "@material-ui/core";
import BarChartIcon from "@material-ui/icons/BarChart";
import "../styles/NavBarStyles.css";
import routes, { routeNames } from "../routes/router";
import { userLogoutAction } from "../store/actions/userActions";
import { useDispatch } from "react-redux";

interface NavBarProps extends RouteProps {}

const NavBar: React.FC<NavBarProps> = ({ history }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const dispatch = useDispatch();
  const { user } = useTypedSelector(state => state);

  const logoutAction = () => {
    setShowProfileModal(false);
    dispatch(userLogoutAction());
    history.push("/");
  };

  return (
    <nav
      className="navbar-container"
      style={{
        justifyContent: user?.username ? "space-between" : "space-around"
      }}
    >
      {user?.username && (
        <div className="navbar-logo">
          <Link to={routes[routeNames.GAMES_SCREEN].path} className="react-link">
            <h3>Multiplayer Games</h3>
          </Link>
        </div>
      )}
      <div className="navbar-navlink">
        <Link className="nav-link react-link" to={routes[routeNames.CHESS_TEST].path}>
          Chess Board
        </Link>
      </div>
      <div className="navbar-navlink">
        <Link className="nav-link react-link" to={routes[routeNames.CHECKERS_TEST].path}>
          Checkers Board
        </Link>
      </div>

      {user.username && (
        <div className="nav-profile-container">
          <div
            className="nav-profile-icon"
            onClick={() => setShowProfileModal(!showProfileModal)}
          >
            {user.profilePictureUrl.length > 0 ? (
              <ProfilePic src={user.profilePictureUrl} navbar />
            ) : (
              <AccountCircleIcon />
            )}
            <ArrowDropDownRoundedIcon />
          </div>

          {showProfileModal && (
            <div className="nav-profile-modal">
              <ListItem className="d-flex align-items-center profile-list-group-item">
                <AccountCircleIcon style={{ fill: "#0984e3" }} />
                <span className="ml-2">
                  <Link
                    to={`/profile`}
                    onClick={() => setShowProfileModal(false)}
                    className="react-link"
                  >
                    {user.username}
                  </Link>
                </span>
              </ListItem>

              <ListItem className="d-flex align-items-center profile-list-group-item">
                <BarChartIcon style={{ fill: "#fff" }} />
                <span className="ml-2">
                  <Link
                    to={`/stats`}
                    onClick={() => setShowProfileModal(false)}
                    className="react-link"
                  >
                    Statistics
                  </Link>
                </span>
              </ListItem>

              <ListItem
                onClick={logoutAction}
                className="d-flex align-items-center profile-list-group-item"
              >
                <ExitToAppRoundedIcon style={{ fill: "red" }} />
                <span className="ml-2">
                  <Link to="/" className="react-link">
                    Logout
                  </Link>
                </span>
              </ListItem>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default withRouter(NavBar);
