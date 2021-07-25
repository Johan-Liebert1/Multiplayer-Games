import React from "react";
import CanvasComponent from "../components/CanvasComponent";
import Chat from "../components/Chat";

const SketchIOScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "95vh",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div style={{ width: "75%" }}>
        <CanvasComponent />
      </div>
      <div style={{ width: "25%" }}>
        <Chat />
      </div>
    </div>
  );
};

export default SketchIOScreen;
