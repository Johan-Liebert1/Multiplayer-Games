import React from "react";
import ChessBoard from "../components/ChessBoard";
import { RouteProps } from "../types/routeProps";

interface ChessScreenProps extends RouteProps {}

const ChessScreen: React.FC<ChessScreenProps> = () => {
  return (
    <div style={{ marginLeft: "4rem" }}>
      <ChessBoard />
    </div>
  );
};

export default ChessScreen;
