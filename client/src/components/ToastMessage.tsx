import React from "react";
import ErrorIcon from "@material-ui/icons/Error";
import { ToastType } from "../types/store/toastsTypes";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";

interface ToastMessageProps {
  header?: string;
  message: string;
  type: ToastType;
}

const getSvg = (type: ToastType) => {
  const s = { fontSize: "3rem" };

  switch (type) {
    case "success":
      return <CheckCircleRoundedIcon style={s} />;
    case "info":
      return <InfoRoundedIcon style={s} />;
    case "warning":
      return <WarningRoundedIcon style={s} />;
    case "error":
      return <ErrorIcon style={s} />;
  }
};

const ToastMessage: React.FC<ToastMessageProps> = ({ header, message, type }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", color: "white !important" }}>
      <div style={{ marginRight: "1rem" }}>{getSvg(type)}</div>
      <div>
        {header && <h3>{header}</h3>}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ToastMessage;
