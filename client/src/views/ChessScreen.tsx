import React from "react";
import ChessBoard from "../components/chess/ChessBoard";
import { RouteProps } from "../types/routeProps";

import {
    boardStyles,
    chatStyles,
    wrapperDivStyles,
} from "../styles/gameScreenStyles";
import RoomId from "../components/allGames/RoomId";
import Chat from "../components/allGames/Chat";
import useUserPresent from "../hooks/useUserPresent";
import useWindowSize from "../hooks/useWindowSize";

interface ChessScreenProps extends RouteProps {}

const ChessScreen: React.FC<ChessScreenProps> = ({ match, history }) => {
    useUserPresent(history);

    const [windowWidth] = useWindowSize();
    const bigScreen = windowWidth > 1000;

    return (
        <div
            style={{
                ...wrapperDivStyles,
                flexDirection: bigScreen ? "row" : "column",
            }}
        >
            <div style={boardStyles}>
                <ChessBoard roomId={match.params.roomId as string} />
            </div>

            <div
                style={{
                    ...chatStyles,
                    minWidth: bigScreen ? "35%" : "50%",
                    maxWidth: bigScreen ? "35%" : "50%",
                }}
            >
                <RoomId roomId={match.params.roomId as string} />
                <Chat />
            </div>
        </div>
    );
};

export default ChessScreen;
