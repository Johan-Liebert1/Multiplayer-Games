import React, { useRef } from "react";

import {
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
  FormGroup
} from "@material-ui/core/";
import SVG, { svgNames } from "../components/Svg";

interface RoomIdProps {
  roomId: string;
}

const RoomId: React.FC<RoomIdProps> = ({ roomId }) => {
  const roomIdElement = useRef<HTMLInputElement>(null);

  const copyRoomId = () => {
    (roomIdElement.current as HTMLInputElement).querySelector("input")!.select();
    document.execCommand("copy");
  };

  return (
    <FormGroup>
      <InputLabel htmlFor="outlined-adornment-password">Room Id</InputLabel>
      <FilledInput
        id="standard-read-only-input"
        fullWidth
        defaultValue={roomId}
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
  );
};

export default RoomId;
