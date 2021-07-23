import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

export interface UserState {
  username: string;
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  id: number;
}

export type SocketState = Socket<DefaultEventsMap, DefaultEventsMap>;
