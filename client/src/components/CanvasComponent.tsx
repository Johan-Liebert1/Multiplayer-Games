import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import SketchIO from "../classes/sketchio/SketchIO";
import { useTypedSelector } from "../hooks/useTypedSelector";
import useWindowSize from "../hooks/useWindowSize";
import "../styles/Canvas.css";
import { chatBoxStyles } from "../styles/gameScreenStyles";

import { Button, List, ListItem } from "@material-ui/core";
import { SocketState } from "../types/store/storeTypes";
import { io } from "socket.io-client";
import { socketEmitEvents, socketListenEvents } from "../types/socketEvents";
import { setSocketAction } from "../store/actions/socketActions";
import { withRouter } from "react-router-dom";
import { RouteProps } from "../types/routeProps";

let sketchIO: SketchIO;
let socket: SocketState;

interface CanvasComponentProps extends RouteProps {
  roomId: string;
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ roomId }) => {
  const dispatch = useDispatch();
  const { user } = useTypedSelector(state => state);

  const classes = chatBoxStyles();

  const [windowWidth, windowHeight] = useWindowSize();
  const bigScreen = windowWidth > 1300;

  const paintFillButton = useRef<HTMLButtonElement>(null);
  const canvasContainer = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: windowHeight * 0.8
  });
  const [chosenColor, setChosenColor] = useState("white");

  const colors = [
    "white",
    "black",
    "#27ae60",
    "#2980b9",
    "#16a085",
    "#d63031",
    "#f1c40f"
  ];

  const setCanvasCursor = (cursor: "fill" | "paint") => {
    if (cursor === "fill") {
      (
        canvasRef?.current as HTMLCanvasElement
      ).style.cursor = `url("data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='24px' height='24px' fill='white' stroke='black' viewBox='0 0 24 24' xml:space='preserve'%3E %3Cpath d='M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z'/%3E %3C/svg%3E"), auto`;
    } else {
      (
        canvasRef?.current as HTMLCanvasElement
      ).style.cursor = `url("data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='24px' height='24px' fill='white' stroke='black' stroke-width='1' viewBox='0 0 24 24' xml:space='preserve'%3E %3Cpath d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'/%3E %3C/svg%3E") 0 24, auto`;
    }
  };

  const handleButtonClick = () => {
    if (!paintFillButton.current) return;

    sketchIO.toggleFillPaint();

    if (sketchIO.getPainting()) {
      paintFillButton.current.innerText = "Fill";
      setCanvasCursor("paint");
    }

    if (sketchIO.getFilling()) {
      paintFillButton.current.innerText = "Paint";
      setCanvasCursor("fill");
    }
  };

  useEffect(() => {
    if (canvasContainer.current) {
      setCanvasDimensions({
        width: canvasContainer.current.offsetWidth,
        height: windowHeight * 0.9
      });
    }
  }, [canvasContainer, windowHeight, windowWidth]);

  const changeCanvasColor = (color: string) => {
    setChosenColor(color);
    sketchIO.changeCanvasColor(color);
  };

  useEffect(() => {
    socket = io("http://localhost:8000");

    socket.emit(socketEmitEvents.JOIN_A_ROOM, {
      roomId: `sketchio_${roomId}`,
      username: user.username
    });

    dispatch(setSocketAction(socket));

    const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    setCanvasCursor("paint");

    sketchIO = new SketchIO(canvas, ctx, socket);
    sketchIO.enableCanvas();

    return () => {
      sketchIO.disableCanvas();
    };
  }, []);

  useEffect(() => {
    socket.on(socketListenEvents.BEGAN_PATH, (data: { x: number; y: number }) => {
      sketchIO.beginPath(data.x, data.y);
    });

    socket.on(
      socketListenEvents.STROKED_PATH,
      (data: { x: number; y: number; color: string }) => {
        sketchIO.drawPath(data.x, data.y, data.color);
      }
    );

    socket.on(socketListenEvents.STARTED_FILLING, (data: { color: string }) => {
      sketchIO.fill(data.color);
    });
  }, []);

  return (
    <div className="canvasSuperContainer">
      <List
        dense={true}
        className={classes.messagesContainer}
        style={{
          alignSelf: "flex-start",
          height: canvasDimensions.height + "px",
          minWidth: "10rem",
          width: "20%"
        }}
      >
        <ListItem style={{ wordBreak: "break-all" }}>
          <h2>Points</h2>
        </ListItem>
      </List>

      <div className="canvasContainer" style={{ width: "70%" }} ref={canvasContainer}>
        <div id="sketchInfo"></div>
        <canvas
          id="drawingCanvas"
          width={canvasDimensions.width}
          height={canvasDimensions.height}
          ref={canvasRef}
        />
      </div>
      <div
        className="colorsContainer"
        style={
          bigScreen
            ? { maxWidth: "10%", height: canvasDimensions.height + "px" }
            : {
                width: "100%",
                flexDirection: "row"
              }
        }
      >
        {colors.map(color => (
          <div
            onClick={() => changeCanvasColor(color)}
            className="color"
            style={{ backgroundColor: color }}
            key={color}
          ></div>
        ))}
        <div id="sketchIOButton">
          <Button
            ref={paintFillButton}
            onClick={handleButtonClick}
            variant="contained"
            color="primary"
            style={{ marginLeft: "5px" }}
          >
            Fill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(CanvasComponent);
