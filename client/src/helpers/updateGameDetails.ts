import { AxiosRequestConfig } from "axios";
import { axiosInstance } from "../config/axiosConfig";
import { UpdateGameDetails } from "../types/games";

export const updateGameDetailsApiCall = (
  username: string,
  token: string,
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

  const url = `/games/${game}/${username}`;

  const config: AxiosRequestConfig = {
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`
    }
  };

  axiosInstance.post(url, data, config);
};
