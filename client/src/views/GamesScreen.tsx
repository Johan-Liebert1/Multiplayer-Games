import React from "react";
import GameCard from "../components/GameCard";
import { Games } from "../types/games";

const GamesScreen: React.FC = () => {
  const divStyles = {
    width: window.innerWidth > 10000 ? "70%" : "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 5rem"
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
