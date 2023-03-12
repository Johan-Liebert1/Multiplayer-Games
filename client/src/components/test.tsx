import { NewBishop } from "../classes/newchess/NewBishop";
import { NewChessGame } from "../classes/newchess/NewChessGame";
import { NewKnight } from "../classes/newchess/NewKnight";
import { NewRook } from "../classes/newchess/NewRook";

const TestComponent = () => {
    const b = new NewKnight('black', 'bishop', 3, 5);
    b.calculateMoves(new NewChessGame());

    console.log(b.pieceName, b.moves);

    return <div>TestComponenttest</div>;
};

export default TestComponent;
