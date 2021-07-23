import React, { useRef } from "react";
import ChessBoard from "../components/ChessBoard";
import { RouteProps } from "../types/routeProps";

import {
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
  FormGroup
} from "@material-ui/core/";
import { boardStyles, chatStyles, wrapperDivStyles } from "../styles/gameScreenStyles";
import SVG, { svgNames } from "../components/Svg";

interface ChessScreenProps extends RouteProps {}

const ChessScreen: React.FC<ChessScreenProps> = ({ match }) => {
  const roomIdElement = useRef<HTMLInputElement>(null);

  const copyRoomId = () => {
    (roomIdElement.current as HTMLInputElement).querySelector("input")!.select();
    document.execCommand("copy");
  };

  return (
    <div style={wrapperDivStyles}>
      <div style={boardStyles}>
        <ChessBoard roomId={match.params.roomId as string} />
      </div>

      <div style={chatStyles}>
        <FormGroup>
          <InputLabel htmlFor="outlined-adornment-password">Room Id</InputLabel>
          <FilledInput
            id="standard-read-only-input"
            fullWidth
            defaultValue={match.params.roomId as string}
            readOnly
            ref={roomIdElement}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={copyRoomId} edge="end">
                  {SVG(svgNames.copyIcon)}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormGroup>
      </div>
    </div>
  );
};

export default ChessScreen;
