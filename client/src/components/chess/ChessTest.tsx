// react stuff
import React, { useState, useRef } from "react";

// gameplay
import AnalysisBoard from "../../classes/chess/AnalysisBoard";

// types
import { ChessBoardType } from "../../types/chessTypes";
import { CELL_SIZE } from "../../types/games";
import { RouteProps } from "../../types/routeProps";
import { getNewChessBoard } from "../../helpers/chessHelpers";
import { Button, List, ListItem, makeStyles } from "@material-ui/core";
import { axiosInstance } from "../../config/axiosConfig";
import { useTypedSelector } from "../../hooks/useTypedSelector";

import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { chatBoxStyles } from "../../styles/gameScreenStyles";
import { getChessMovesFromString } from "../../helpers/globalHelpers";
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

const ChessBoardTest: React.FC<ChessBoardProps> = () => {
  const classes = chatBoxStyles();
  const listStyles = listClass();

  const { user } = useTypedSelector(state => state);

  const [board, setBoard] = useState<ChessBoardType>(() => getNewChessBoard());
  const [allGamesList, setAllGamesList] = useState<GameListItem[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingGameId, setAnalyzingGameId] = useState<number>(-1);

  const chessBoardRef = useRef<HTMLDivElement | null>(null);

  const analyzeGame = (gameId: number) => {
    setAnalyzing(true);
    setAnalyzingGameId(gameId);

    const game = allGamesList.find(g => g.game_id === gameId);

    setBoard(() => getNewChessBoard());

    const { moves, promotionMoveIndices } = getChessMovesFromString(
      game?.moves as string
    );

    analysisBoard = new AnalysisBoard(moves, promotionMoveIndices);
    analysisBoard.setInitiallyAttackedCells(board);
  };

  const playMove = () => {
    const tempBoard = board.map(r => r);
    analysisBoard.playNextMove(tempBoard);
    setBoard(tempBoard);
    return;
  };

  const getAllChessGames = () => {
    axiosInstance
      .get(`/games/chess/${user.username}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      .then(resp => setAllGamesList(resp.data.games));
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
            flexDirection: "column"
          }}
        >
          <RenderChessBoard
            board={board}
            chessBoardRef={chessBoardRef}
            userPieceColor={"white"}
            movePiece={(i: number, j: number) => {
              return;
            }}
            testBoard={true}
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
                <span style={{ width: "30%" }}>
                  {`${game.date.split("T")[0]}   ${
                    game.date.split("T")[1].split(".")[0]
                  }`}
                </span>
              </ListItem>
            ))}
          </div>

          <ListItem style={{ height: "10%" }}>
            <Button variant="contained" onClick={getAllChessGames}>
              Get All Games
            </Button>
          </ListItem>
        </List>
      </div>
    </div>
  );
};

export default ChessBoardTest;
