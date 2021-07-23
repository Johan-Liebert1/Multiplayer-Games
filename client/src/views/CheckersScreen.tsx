import React from "react";
import CheckersBoard from "../components/CheckersBoard";
import RoomId from "../components/RoomId";
import { boardStyles, chatStyles, wrapperDivStyles } from "../styles/gameScreenStyles";
import { RouteProps } from "../types/routeProps";

interface CheckersScreenProps extends RouteProps {}

const CheckersScreen: React.FC<CheckersScreenProps> = ({ match }) => {
  return (
    <div style={wrapperDivStyles}>
      <div style={boardStyles}>
        <CheckersBoard roomId={match.params.roomId as string} />
      </div>

      <div style={chatStyles}>
        <RoomId roomId={match.params.roomId as string} />
      </div>
    </div>
  );
};

export default CheckersScreen;
