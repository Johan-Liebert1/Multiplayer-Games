// react stuff
import React, { useState, useEffect, useRef } from "react";

// components
import GameOverComponent from "../allGames/GameOverComponent";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import RenderCheckersBoard from "./RenderCheckersBoard";

// checkers
import CheckersAnalysis from "../../classes/checkers/CheckersAnalysis";

// types
import { CheckersBoardType, CheckersPieceColor } from "../../types/checkersTypes";
import { RouteProps } from "../../types/routeProps";
import { getNewCheckersBoard } from "../../helpers/checkersBoard";
import { CELL_SIZE } from "../../types/games";
import { Button, List, ListItem, makeStyles } from "@material-ui/core";
import { chatBoxStyles } from "../../styles/gameScreenStyles";
import { axiosInstance } from "../../config/axiosConfig";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { getCheckersMovesFromString } from "../../helpers/globalHelpers";

let analysisBoard: CheckersAnalysis;

interface GameListItem {
  player1: string;
  player2: string;
  moves: string;
  date: string;
  game_id: number;
}

interface CheckersBoardProps extends RouteProps {}

const listClass = makeStyles(t => ({
  listItem: {
    "&:hover": {
      backgroundColor: "#0b1622",
      color: "#0984e3",
      cursor: "pointer"
    }
  },
  listItemClicked: {
    backgroundColor: "#0b1622",
    color: "#0984e3"
  }
}));

interface GameOverState {
  gameOver: boolean;
  winnerName: string;
  winnerColor: CheckersPieceColor;
}

const CheckersTestBoard: React.FC<CheckersBoardProps> = () => {
  const classes = chatBoxStyles();
  const listStyles = listClass();

  const { user } = useTypedSelector(state => state);

  const [board, setBoard] = useState<CheckersBoardType>(() => getNewCheckersBoard());
  const [allGamesList, setAllGamesList] = useState<GameListItem[]>([]);
  const [analyzingGameId, setAnalyzingGameId] = useState<number>(-1);
  const [analyzing, setAnalyzing] = useState(false);

  const [gameOver, setGameOver] = useState<GameOverState>({
    gameOver: false,
    winnerName: "",
    winnerColor: "" as CheckersPieceColor
  });

  let [userPieceColor, setUserPieceColor] = useState<CheckersPieceColor>("white");

  const checkersBoardRef = useRef<HTMLDivElement | null>(null);

  const analyzeGame = (gameId: number) => {
    setAnalyzing(true);
    setAnalyzingGameId(gameId);

    const game = allGamesList.find(g => g.game_id === gameId);

    setBoard(() => getNewCheckersBoard());

    const moves = getCheckersMovesFromString(game?.moves as string);

    analysisBoard = new CheckersAnalysis(moves);
  };

  const playMove = () => {
    const tempBoard = board.map(r => r);
    analysisBoard.playNextMove(tempBoard);
    setBoard(tempBoard);
    return;
  };

  return (
    <div style={{ marginLeft: "4rem", display: "flex" }}>
      <div id="checkersBoard" style={{ position: "relative" }}>
        {gameOver.gameOver && (
          <GameOverComponent
            winnerColor={gameOver.winnerColor}
            winnerName={gameOver.winnerName}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: userPieceColor === "white" ? "column" : "column"
          }}
          ref={checkersBoardRef}
        >
          <RenderCheckersBoard
            board={board}
            checkersBoardRef={checkersBoardRef}
            userPieceColor={userPieceColor}
            testBoard={true}
            movePiece={(i: number, j: number) => {
              return;
            }}
          />
        </div>
        <div
          style={{
            padding: "0.5rem 0",
            display: "flex",
            justifyContent: "space-evenly"
          }}
        >
          <Button variant="contained" disabled={!analyzing}>
            <KeyboardArrowLeftIcon />
          </Button>

          <Button variant="contained">Analyze</Button>

          <Button variant="contained" onClick={playMove} disabled={!analyzing}>
            <KeyboardArrowRightIcon />
          </Button>
        </div>
      </div>

      <div
        className={classes.messagesContainer}
        style={{ height: `${CELL_SIZE * board.length}px`, width: "100%" }}
      >
        <List
          style={{
            height: `${CELL_SIZE * board.length}px`,
            display: "flex",
            flexDirection: "column",
            overflow: "auto"
          }}
        >
          <div style={{ height: "90%" }}>
            {allGamesList.map((game, index) => (
              <ListItem
                key={game.game_id}
                onClick={() => {
                  analyzeGame(game.game_id);
                }}
                className={
                  game.game_id === analyzingGameId
                    ? listStyles.listItemClicked
                    : listStyles.listItem
                }
              >
                <h5 style={{ width: "10%" }}>{index + 1}</h5>
                <span style={{ width: "60%" }}>
                  {game.player1} vs {game.player2}
                </span>
                <span style={{ width: "30%" }}>{"  " + game.date.split("T")[0]}</span>
              </ListItem>
            ))}
          </div>

          <ListItem style={{ height: "10%" }}>
            <Button
              variant="contained"
              onClick={() => {
                axiosInstance
                  .get(`/games/checkers/${user.username}`)
                  .then(resp => setAllGamesList(resp.data.games));
              }}
            >
              Get All Games
            </Button>
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default CheckersTestBoard;
