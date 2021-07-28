import React from "react";
import Chat from "../components/allGames/Chat";
import CheckersBoard from "../components/checkers/CheckersBoard";
import RoomId from "../components/allGames/RoomId";
import useUserPresent from "../hooks/useUserPresent";
import useWindowSize from "../hooks/useWindowSize";
import { boardStyles, chatStyles, wrapperDivStyles } from "../styles/gameScreenStyles";
import { RouteProps } from "../types/routeProps";

interface CheckersScreenProps extends RouteProps {}

const CheckersScreen: React.FC<CheckersScreenProps> = ({ match, history }) => {
  useUserPresent(history);

  const [windowWidth] = useWindowSize();
  const bigScreen = windowWidth > 1000;

  return (
    <div style={{ ...wrapperDivStyles, flexDirection: bigScreen ? "row" : "column" }}>
      <div style={boardStyles}>
        <CheckersBoard roomId={match.params.roomId as string} />
      </div>

      <div
        style={{
          ...chatStyles,
          minWidth: bigScreen ? "35%" : "50%",
          maxWidth: bigScreen ? "35%" : "50%"
        }}
      >
        <RoomId roomId={match.params.roomId as string} />
        <Chat />
      </div>
    </div>
  );
};

export default CheckersScreen;
