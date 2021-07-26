import React from "react";
import CanvasComponent from "../components/CanvasComponent";
import Chat from "../components/Chat";
import RoomId from "../components/RoomId";
import useWindowSize from "../hooks/useWindowSize";
import { chatStyles } from "../styles/gameScreenStyles";
import { RouteProps } from "../types/routeProps";

interface SketchIOScreenProps extends RouteProps {}

const SketchIOScreen: React.FC<SketchIOScreenProps> = ({ match }) => {
  const [windowWidth] = useWindowSize();
  const bigScreen = windowWidth > 1300;

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        flexDirection: bigScreen ? "row" : "column"
      }}
    >
      <div style={{ width: bigScreen ? "75%" : "100%" }}>
        <CanvasComponent roomId={match.params.roomId as string} />
      </div>
      <div
        style={{
          ...chatStyles,
          minWidth: bigScreen ? "25%" : "50%",
          maxWidth: bigScreen ? "25%" : "50%",
          marginTop: bigScreen ? 0 : "3rem"
        }}
      >
        <RoomId roomId={match.params.roomId as string} />
        <Chat />
      </div>
    </div>
  );
};

export default SketchIOScreen;
