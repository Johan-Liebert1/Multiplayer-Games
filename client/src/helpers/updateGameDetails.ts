import { AxiosRequestConfig } from "axios";
import { axiosInstance } from "../config/axiosConfig";
import { UpdateGameDetails } from "../types/games";

export const updateGameDetailsApiCall = (
  userId: number,
  game: "chess" | "checkers",
  object: {
    won?: boolean;
    lost?: boolean;
    drawn?: boolean;
    started?: boolean;
  }
) => {
  const data: UpdateGameDetails = {
    won: false,
    lost: false,
    drawn: false,
    started: false,
    ...object
  };

  const url = `/${game}/${userId}`;

  const config: AxiosRequestConfig = {
    headers: {
      "content-type": "application/json"
    }
  };

  axiosInstance.post(url, data, config);
};
