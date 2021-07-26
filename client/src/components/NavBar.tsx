import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { RouteProps } from "../types/routeProps";
import ProfilePic from "./ProfilePic";
import ArrowDropDownRoundedIcon from "@material-ui/icons/ArrowDropDownRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { ListItem } from "@material-ui/core";

import "../styles/NavBarStyles.css";
import routes, { routeNames } from "../routes/router";

interface NavBarProps extends RouteProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  // const dispatch = useDispatch();
  const { user } = useTypedSelector(state => state);

  const logoutAction = () => {
    setShowProfileModal(false);
    // dispatch(logout());
    // history.push("/");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to={routes[routeNames.GAMES_SCREEN].path} className="react-link">
          <h3>Multiplayer Games</h3>
        </Link>
      </div>
      <div className="navbar-navlink">
        <Link className="nav-link react-link" to={`/home`}>
          Likn23
        </Link>
      </div>
      {user.username && (
        <div className="navbar-navlink">
          <Link className="nav-link react-link" to={`/${user.id}/channel`}>
            Link 1
          </Link>
        </div>
      )}

      {user.username && (
        <div className="nav-profile-container">
          <div
            className="nav-profile-icon"
            onClick={() => setShowProfileModal(!showProfileModal)}
          >
            {user.profilePicUrl ? (
              <ProfilePic src={user.profilePicUrl} navbar />
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
                    to={`/${user.id}/profile`}
                    onClick={() => setShowProfileModal(false)}
                    className="react-link"
                  >
                    Profile
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
