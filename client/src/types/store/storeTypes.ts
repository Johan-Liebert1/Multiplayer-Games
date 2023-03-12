import { Socket } from "socket.io-client";
// import { DefaultEventsMap } from "socket.io-client";
import { CheckersPieceColor } from "../checkersTypes";
import { ChessPieceColor } from "../chessTypes";

export interface UserState {
  username: string;
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  profilePictureUrl: string;
  chessPieceColor?: ChessPieceColor;
  checkersPieceColor?: CheckersPieceColor;
  chatColor?: string;
}

export type SocketState = Socket<any, any>;
