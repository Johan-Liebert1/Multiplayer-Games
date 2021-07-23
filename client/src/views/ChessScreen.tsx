import React from "react";
import ChessBoard from "../components/ChessBoard";
import { RouteProps } from "../types/routeProps";

import { boardStyles, chatStyles, wrapperDivStyles } from "../styles/gameScreenStyles";
import RoomId from "../components/RoomId";

interface ChessScreenProps extends RouteProps {}

const ChessScreen: React.FC<ChessScreenProps> = ({ match }) => {
  return (
    <div style={wrapperDivStyles}>
      <div style={boardStyles}>
        <ChessBoard roomId={match.params.roomId as string} />
      </div>

      <div style={chatStyles}>
        <RoomId roomId={match.params.roomId as string} />
      </div>
    </div>
  );
};

export default ChessScreen;
