import React from "react";
import GameCard from "../components/GameCard";
import useUserPresent from "../hooks/useUserPresent";
import { Games } from "../types/games";
import { RouteProps } from "../types/routeProps";

interface GamesScreenProps extends RouteProps {}

const GamesScreen: React.FC<GamesScreenProps> = ({ history }) => {
  useUserPresent(history);

  const divStyles: React.CSSProperties = {
    width: window.innerWidth > 10000 ? "70%" : "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 5rem",
    flexWrap: "wrap"
  };

  const gamesList: Games[] = ["chess", "checkers", "sketchio"];

  return (
    <div style={divStyles}>
      {gamesList.map(g => (
        <GameCard gameName={g} key={g} />
      ))}
    </div>
  );
};

export default GamesScreen;
