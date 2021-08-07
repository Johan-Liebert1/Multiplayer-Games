import React from "react";
import { Link, withRouter } from "react-router-dom";
import { RouteProps } from "../types/routeProps";

import "../styles/DropdownStyles.css";

interface DropdownProps extends RouteProps {
  dropdownItems: { path: string; text: string }[];
  type: "chess" | "checkers";
  close: (type: "chess" | "checkers") => void;
}

const Dropdown: React.FC<DropdownProps> = ({ dropdownItems, location, close, type }) => {
  const handleClick = () => {
    close(type);
  };

  return (
    <div className="dropdown">
      {dropdownItems.map((item, i) => (
        <Link
          onClick={handleClick}
          to={item.path}
          style={{ textDecoration: "none", color: "inherit" }}
          key={i}
        >
          <div
            className={`dropdown-item ${
              location.pathname === item.path ? " selected" : ""
            }`}
            style={{ width: "100%", height: "100%" }}
          >
            {item.text}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default withRouter(Dropdown);
