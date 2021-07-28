import React, { useRef } from "react";

import {
  FilledInput,
  IconButton,
  InputAdornment,
  InputLabel,
  FormControl
} from "@material-ui/core/";
import SVG, { svgNames } from "../Svg";
import { roomIdInputStyles } from "../../styles/gameScreenStyles";

interface RoomIdProps {
  roomId: string;
}

const RoomId: React.FC<RoomIdProps> = ({ roomId }) => {
  const roomIdElement = useRef<HTMLInputElement>(null);

  const copyRoomId = () => {
    (roomIdElement.current as HTMLInputElement).querySelector("input")!.select();
    document.execCommand("copy");
  };

  const roomIdStyles = roomIdInputStyles();

  return (
    <FormControl className={roomIdStyles.root}>
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
              <SVG svgName={svgNames.copyIcon} />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default RoomId;
