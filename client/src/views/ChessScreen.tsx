import React, { useRef } from "react";
import ChessBoard from "../components/ChessBoard";
import { RouteProps } from "../types/routeProps";

import { FilledInput, IconButton, InputAdornment, InputLabel } from "@material-ui/core/";

interface ChessScreenProps extends RouteProps {}

const ChessScreen: React.FC<ChessScreenProps> = ({ match }) => {
  const roomIdElement = useRef<HTMLInputElement>(null);

  return (
    <div style={{ marginLeft: "4rem" }}>
      <ChessBoard roomId={match.params.roomId as string} />
      <InputLabel htmlFor="outlined-adornment-password">Room Id</InputLabel>
      <FilledInput
        id="standard-read-only-input"
        fullWidth
        defaultValue={match.params.roomId as string}
        readOnly
        ref={roomIdElement}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                (roomIdElement.current as HTMLInputElement)
                  .querySelector("input")!
                  .select();
                document.execCommand("copy");
              }}
              edge="end"
            >
              <svg
                focusable="false"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                data-testid="ContentCopyRoundedIcon"
                tabIndex={-1}
                fill="white"
                style={{ outline: "none", border: "none" }}
              >
                <path d="M15 20H5V7c0-.55-.45-1-1-1s-1 .45-1 1v13c0 1.1.9 2 2 2h10c.55 0 1-.45 1-1s-.45-1-1-1zm5-4V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9c1.1 0 2-.9 2-2zm-2 0H9V4h9v12z"></path>
              </svg>
            </IconButton>
          </InputAdornment>
        }
      />
    </div>
  );
};

export default ChessScreen;
