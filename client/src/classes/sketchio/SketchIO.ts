import { socketEmitEvents } from "../../types/socketEvents";
import { SocketState } from "../../types/store/storeTypes";

class SketchIO {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  socket: SocketState;
  initialFillStyle: string;
  initialStrokeStyle: string;
  isPainting: boolean;
  isFilling: boolean;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    socket: SocketState
  ) {
    this.canvas = canvas;
    this.ctx = context;
    this.socket = socket;
    this.initialFillStyle = "white";
    this.initialStrokeStyle = "black";
    this.isPainting = false;
    this.isFilling = false;
    this.setInitialStyles();
  }

  toggleFillPaint = () => {
    this.isPainting = !this.isPainting;
    this.isFilling = !this.isFilling;
  };

  getPainting = () => this.isPainting;

  getFilling = () => this.isFilling;

  fill = (color?: string) => {
    if (!color) {
      this.ctx.fillStyle = this.initialFillStyle;
    } else {
      this.ctx.fillStyle = color;
    }

    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };

  setInitialStyles = () => {
    this.ctx.fillStyle = this.initialFillStyle;
    this.ctx.strokeStyle = this.initialStrokeStyle;
    this.fill(this.ctx.fillStyle);
  };

  changeCanvasColor = (color: string) => {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
  };

  beginPath = (x: number, y: number) => {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  };

  drawPath = (x: number, y: number, color: string) => {
    this.ctx.strokeStyle = color;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  };

  onMouseMove = (e: MouseEvent) => {
    let x = e.offsetX,
      y = e.offsetY;

    if (!this.isPainting) {
      this.beginPath(x, y);
      this.socket.emit(socketEmitEvents.BEGAN_PATH, { x, y });
    } else {
      this.drawPath(x, y, this.ctx.strokeStyle as string);
      this.socket.emit(socketEmitEvents.STROKED_PATH, {
        x,
        y,
        color: this.ctx.strokeStyle
      });
    }
  };

  handleCanvasClick = () => {
    if (this.isFilling) {
      this.fill(this.ctx.fillStyle as string);
      this.socket.emit(socketEmitEvents.STARTED_FILLING, { color: this.ctx.fillStyle });
    }
  };

  setPaintingTrue = () => (this.isPainting = true);
  setPaintingFalse = () => (this.isPainting = false);

  enableCanvas = () => {
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mousedown", this.setPaintingTrue);
    this.canvas.addEventListener("mouseup", this.setPaintingFalse);
    this.canvas.addEventListener("mouseleave", this.setPaintingFalse);
    this.canvas.addEventListener("click", this.handleCanvasClick);
    this.changeCanvasColor("white");
  };

  disableCanvas = () => {
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("mousedown", this.setPaintingTrue);
    this.canvas.removeEventListener("mouseup", this.setPaintingFalse);
    this.canvas.removeEventListener("mouseleave", this.setPaintingFalse);
    this.canvas.removeEventListener("click", this.handleCanvasClick);
  };
}

export default SketchIO;
