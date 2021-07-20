import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import SketchIO from "../classes/sketchio/SketchIO";
import useWindowSize from "../hooks/useWindowSize";
import "../styles/Canvas.css";

let sketchIO: SketchIO;

const CanvasComponent = () => {
  // const dispatch = useDispatch();
  // const { socket } = useSelector(state => state.socket);
  // const { username } = useSelector(state => state.user);

  const colors = [
    "white",
    "black",
    "#27ae60",
    "#2980b9",
    "#16a085",
    "#d63031",
    "#f1c40f"
  ];

  const paintFillButton = useRef<HTMLButtonElement>(null);

  const windowSize = useWindowSize();

  const handleButtonClick = () => {
    if (!paintFillButton.current) return;

    sketchIO.toggleFillPaint();

    if (sketchIO.getPainting()) {
      paintFillButton.current.innerText = "Fill";
    }

    if (sketchIO.getFilling()) {
      paintFillButton.current.innerText = "Paint";
    }
  };

  const changeCanvasColor = (color: string) => {
    sketchIO.changeCanvasColor(color);
  };

  useEffect(() => {
    const canvas = document.getElementById("drawingCanvas") as HTMLCanvasElement;

    // canvas.width = 500;
    // canvas.height = 400;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    sketchIO = new SketchIO(canvas, ctx);
    sketchIO.enableCanvas();

    return () => {
      sketchIO.disableCanvas();
    };
  });

  return (
    <div
      className="canvasSuperContainer"
      style={{ width: window.innerWidth < 1000 ? "100%" : "80%" }}
    >
      <div id="pointsList" style={{ height: windowSize[0] * 0.6 * 0.6 }}></div>
      <div className="canvasContainer">
        <div id="sketchInfo"></div>
        <canvas
          id="drawingCanvas"
          width={windowSize[0] * 0.6 * 0.7}
          height={windowSize[0] * 0.6 * 0.6}
        ></canvas>
        <div id="sketchIOButton">
          <button ref={paintFillButton} onClick={handleButtonClick}>
            Fill
          </button>
        </div>
        <div className="colorsContainer">
          {colors.map(color => (
            <div
              onClick={() => changeCanvasColor(color)}
              className="color"
              style={{ backgroundColor: color }}
              key={color}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CanvasComponent;
