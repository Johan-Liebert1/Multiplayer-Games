import { match } from "react-router-dom";
import { History, Location } from "history";

export interface RouteProps {
  history: History<unknown>;
  location: Location<unknown>;
  match: match<{ [x: string]: string | undefined }>;
}
