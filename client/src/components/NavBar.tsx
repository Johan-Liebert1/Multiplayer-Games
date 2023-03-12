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
import Dropdown from "./Dropdown";

interface NavBarProps extends RouteProps {}

const NavBar: React.FC<NavBarProps> = ({ history }) => {
    const dispatch = useDispatch();
    const { user } = useTypedSelector((state) => state);

    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState({
        chess: false,
        checkers: false,
    });

    const logoutAction = () => {
        setShowProfileModal(false);
        dispatch(userLogoutAction());
        history.push("/");
    };

    const closeDropdown = (type: "chess" | "checkers") => {
        setShowDropdown((old) => ({ ...old, [type]: !old[type] }));
    };

    const chessDropdownItems = [
        { text: "Play Board", path: routes[routeNames.CHESS_PLAY].path },
    ];

    const checkersDropdownItems = [
        { text: "Play Board", path: routes[routeNames.CHECKERS_PLAY].path },
    ];

    // can only have the analysis board available to them if they're logged in
    if (user?.username) {
        chessDropdownItems.unshift({
            text: "Analyze Games",
            path: routes[routeNames.CHESS_TEST].path,
        });
        checkersDropdownItems.unshift({
            text: "Analyze Games",
            path: routes[routeNames.CHECKERS_TEST].path,
        });
    }

    return (
        <nav
            className="navbar-container"
            style={{
                justifyContent: user?.username
                    ? "space-between"
                    : "space-around",
            }}
        >
            <div className="navbar-logo">
                <Link
                    to={
                        user?.username
                            ? routes[routeNames.GAMES_SCREEN].path
                            : routes[routeNames.LOGIN].path
                    }
                    className="react-link"
                >
                    <h3>Multiplayer Games</h3>
                </Link>
            </div>

            <div className="navbar-navlink" style={{ position: "relative" }}>
                <div
                    className={`nav-link react-link ${
                        showDropdown.chess ? "nav-link-active" : ""
                    } `}
                    onClick={() => closeDropdown("chess")}
                >
                    Play Chess
                </div>
                {showDropdown.chess && (
                    <Dropdown
                        dropdownItems={chessDropdownItems}
                        type="chess"
                        close={closeDropdown}
                    />
                )}
            </div>

            <div className="navbar-navlink" style={{ position: "relative" }}>
                <div
                    className={`nav-link react-link ${
                        showDropdown.checkers ? "nav-link-active" : ""
                    } `}
                    onClick={() => closeDropdown("checkers")}
                >
                    Play Checkers
                </div>
                {showDropdown.checkers && (
                    <Dropdown
                        dropdownItems={checkersDropdownItems}
                        type="checkers"
                        close={closeDropdown}
                    />
                )}
            </div>

            {user.username && (
                <div className="nav-profile-container">
                    <div
                        className="nav-profile-icon"
                        onClick={() => setShowProfileModal(!showProfileModal)}
                    >
                        {user?.profilePictureUrl?.length > 0 ? (
                            <ProfilePic src={user.profilePictureUrl} navbar />
                        ) : (
                            <AccountCircleIcon />
                        )}
                        <ArrowDropDownRoundedIcon />
                    </div>

                    {showProfileModal && (
                        <div className="nav-profile-modal">
                            <ListItem className="d-flex align-items-center profile-list-group-item">
                                <AccountCircleIcon
                                    style={{ fill: "#0984e3" }}
                                />
                                <span className="ml-2">
                                    <Link
                                        to={`/profile`}
                                        onClick={() =>
                                            setShowProfileModal(false)
                                        }
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
                                        onClick={() =>
                                            setShowProfileModal(false)
                                        }
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
