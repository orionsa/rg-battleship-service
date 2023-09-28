import { ICell } from './Board.interface';
import { genId } from '../nanoid';
import { BOARD_SIZE } from '../constants';

export class Board {
  id: string;
  rows: ICell[][];
  private readonly boardSize: number = BOARD_SIZE;

  constructor() {
    this.id = genId({ prefix: 'board_' });
    this.rows = this.initBoard();
  }

  private initBoard(): ICell[][] {
    const rows: ICell[][] = [];

    for (let i = 0; i < this.boardSize; i++) {
      rows[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        rows[i].push({
          id: `${i}${j}`,
          coordinates: { x: i, y: j },
          isHit: false,
          hasShip: false,
        });
      }
    }

    return rows;
  }
}
