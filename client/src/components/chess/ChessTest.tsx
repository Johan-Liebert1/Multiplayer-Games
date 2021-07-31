// react stuff
import React, { useState, useRef } from "react";

// components
import Cell from "../allGames/Cell";

// gameplay
import AnalysisBoard from "../../classes/chess/AnalysisBoard";
import ChessPiece from "../../classes/chess/ChessPiece";

// types
import { ChessBoardType, ChessPieceColor } from "../../types/chessTypes";
import { CELL_SIZE, ClickedCellsType } from "../../types/games";
import { RouteProps } from "../../types/routeProps";
import { getNewChessBoard } from "../../helpers/chessHelpers";
import { Button, List, ListItem, ListItemText } from "@material-ui/core";
import { axiosInstance } from "../../config/axiosConfig";
import { useTypedSelector } from "../../hooks/useTypedSelector";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { chatBoxStyles } from "../../styles/gameScreenStyles";
import { getMovesFromString } from "../../helpers/globalHelpers";
import RenderChessBoard from "./RenderChessBoard";

let analysisBoard: AnalysisBoard;

interface ChessBoardProps extends RouteProps {}
interface GameListItem {
  player1: string;
  player2: string;
  moves: string;
  date: string;
  game_id: number;
}

const ChessBoardTest: React.FC<ChessBoardProps> = () => {
  const classes = chatBoxStyles();

  const { user } = useTypedSelector(state => state);

  const [board, setBoard] = useState<ChessBoardType>(() => getNewChessBoard());
  const [userPieceColor, setUserPieceColor] = useState<ChessPieceColor>("white");
  const [allGamesList, setAllGamesList] = useState<GameListItem[]>([]);

  const chessBoardRef = useRef<HTMLDivElement | null>(null);

  const analyzeGame = (gameId: number) => {
    const game = allGamesList.find(g => g.game_id === gameId);

    const moves = getMovesFromString(game?.moves as string);

    analysisBoard = new AnalysisBoard(moves);
    analysisBoard.setInitiallyAttackedCells(board);
  };

  const playMove = () => {
    const tempBoard = board.map(r => r);
    analysisBoard.playNextMove(tempBoard);
    setBoard(tempBoard);
    return;
  };

  return (
    <div style={{ margin: "2rem 4rem", display: "flex" }}>
      <div
        id="checkersBoard"
        style={{
          position: "relative",
          background: "url(/images/chess/chessBoard.jpg)",
          objectFit: "contain",
          backgroundSize: `${CELL_SIZE * board.length}px, ${CELL_SIZE * board.length}px`,
          width: `${CELL_SIZE * board.length}px`,
          height: `${CELL_SIZE * board.length}px`,
          margin: 0,
          padding: 0
        }}
        ref={chessBoardRef}
      >
        <div
          style={{
            display: "flex",
            flexDirection: userPieceColor === "white" ? "column" : "column"
          }}
        >
          <RenderChessBoard
            board={board}
            chessBoardRef={chessBoardRef}
            userPieceColor={userPieceColor}
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
          {/* <Button
          variant="contained"
          color="default"
          onClick={() => {
            const data = JSON.stringify({
              player1: user.username,
              player2: "Johan",
              moves: game.getAllMoves()
            });

            axiosInstance
              .post("/games/chess/savegame", data, {
                headers: {
                  "content-type": "application/json"
                }
              })
              .then(resp => {
                console.log(resp.data);
              });
          }}
          >
            save game
          </Button> */}
          <Button variant="contained">
            <KeyboardArrowLeftIcon />
          </Button>

          <Button variant="contained">Analyze</Button>

          <Button variant="contained" onClick={playMove}>
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
          {allGamesList.map((game, index) => (
            <ListItem
              style={{ height: "90%" }}
              key={game.game_id}
              onClick={() => analyzeGame(game.game_id)}
            >
              <h5 style={{ width: "10%" }}>{index + 1}</h5>
              <span style={{ width: "60%" }}>
                {game.player1} vs {game.player2}
              </span>
              <span style={{ width: "30%" }}>{"  " + game.date.split("T")[0]}</span>
            </ListItem>
          ))}

          <ListItem style={{ height: "10%" }}>
            <Button
              variant="contained"
              onClick={() => {
                axiosInstance
                  .get(`/games/chess/${user.username}`)
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

export default ChessBoardTest;
