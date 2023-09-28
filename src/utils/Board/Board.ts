import { IBoard } from './Board.interface';
import { genId } from '../nanoid';
import { BOARD_SIZE } from '../constants';

export class Board {
  id: string;
  board: IBoard;
  private readonly boardSize: number = BOARD_SIZE;

  constructor() {
    this.id = genId({ prefix: 'board_' });
    this.board = this.initBoard();
  }

  private initBoard(): IBoard {
    const board: IBoard = {
      rows: [],
    };

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        board.rows[i].cells.push({
          id: `${i}${j}`,
          coordinates: { x: i, y: j },
          isHit: false,
          hasShip: false,
        });
      }
    }

    return board;
  }
}
