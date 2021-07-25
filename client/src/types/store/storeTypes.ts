import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { CheckersPieceColor } from "../checkersTypes";
import { ChessPieceColor } from "../chessTypes";

export interface UserState {
  username: string;
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  id: number;
  profilePicUrl: string;
  chessPieceColor?: ChessPieceColor;
  checkersPieceColor?: CheckersPieceColor;
  chatColor?: string;
}

export type SocketState = Socket<DefaultEventsMap, DefaultEventsMap>;
