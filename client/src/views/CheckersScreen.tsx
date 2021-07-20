import React from "react";
import CheckersBoard from "../components/CheckersBoard";
import { RouteProps } from "../types/routeProps";

interface CheckersScreenProps extends RouteProps {}

const CheckersScreen: React.FC<CheckersScreenProps> = () => {
  return (
    <div style={{ marginLeft: "4rem" }}>
      <CheckersBoard />
    </div>
  );
};

export default CheckersScreen;
