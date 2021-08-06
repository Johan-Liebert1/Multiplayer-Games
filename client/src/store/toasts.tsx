import React from "react";
import { toast, ToastOptions } from "react-toastify";

import ToastMessage from "../components/ToastMessage";
import { ToastType } from "../types/store/toastsTypes";

export type ToastMessageType = { header?: string; message: string };

const showToast = (
  type: ToastType,
  message: ToastMessageType,
  options?: ToastOptions
) => {
  const newOptions: ToastOptions = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: 1000,
    ...options
  };

  message.header = message.header || type[0].toUpperCase() + type.slice(1);

  switch (type) {
    case "success":
      toast.success(
        <ToastMessage type={type} header={message.header} message={message.message} />,
        newOptions
      );
      break;

    case "warning":
      toast.warning(
        <ToastMessage type={type} header={message.header} message={message.message} />,
        newOptions
      );
      break;

    case "info":
      toast.info(
        <ToastMessage type={type} header={message.header} message={message.message} />,
        newOptions
      );
      break;

    case "error":
      toast.error(
        <ToastMessage type={type} header={message.header} message={message.message} />,
        newOptions
      );
      break;
  }
};

export default showToast;
