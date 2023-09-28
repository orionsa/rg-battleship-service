import { ICell } from './Board.interface';
import { genId } from '../nanoid';
import { BOARD_SIZE } from '../constants';
import { Fleet } from '../Fleet/Fleet';
import { ICoordinate } from '../shared.interface';
// import { IPositionShipDto } from '../Fleet/Fleet.interface';

export class Board {
  private readonly boardSize = BOARD_SIZE;
  id: string;
  rows: ICell[][];
  fleet: Fleet;
  // blockedCoordinats: Set<ICoordinate>;
  shipBlockedCoordinates: Map<string, ICoordinate[]>;

  constructor() {
    this.id = genId({ prefix: 'board_' });
    this.rows = this.initBoard();
    this.fleet = new Fleet();
    this.shipBlockedCoordinates = new Map();
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

  public getBlockedCellsByParams({
    startCoordinate,
    direction,
    shipSize,
  }): Set<ICoordinate> {
    /**
     * get the cells that will be blocked by a ships position, direction and size
     */
    let coordinates: ICoordinate[] = [];
    const coorToChange = direction === 'vertical' ? 'x' : 'y';
    const staticCoor = direction === 'vertical' ? 'y' : 'x';
    for (
      let i = startCoordinate[staticCoor] - 1;
      i <= startCoordinate[staticCoor] + shipSize;
      i++
    ) {
      coordinates.push(
        {
          [staticCoor]: i,
          [coorToChange]: startCoordinate[coorToChange] - 1,
        } as unknown as ICoordinate,
        {
          [staticCoor]: i,
          [coorToChange]: startCoordinate[coorToChange],
        } as unknown as ICoordinate,
        {
          [staticCoor]: i,
          [coorToChange]: startCoordinate[coorToChange] + 1,
        } as unknown as ICoordinate,
      );
    }

    // filter out of bounds cells
    coordinates = coordinates.filter(
      (coor) =>
        coor.x >= 0 &&
        coor.x < this.boardSize &&
        coor.y >= 0 &&
        coor.y < this.boardSize,
    );

    return new Set(coordinates);
  }

  public getBlockedCells(shipId: string): Set<ICoordinate> {
    /**
     * get all blocked cell beside the ones that are blocked by a specific ship.
     */
    const mapCopy = new Map(this.shipBlockedCoordinates);
    mapCopy.delete(shipId);
    const set: Set<ICoordinate> = new Set();
    mapCopy.forEach((ship) => ship.forEach((coor) => set.add(coor)));
    return set;
  }

  public checkCellsOverlapping(
    shipBlockedCells: Set<ICoordinate>,
    boardBlockedCells: Set<ICoordinate>,
  ): boolean {
    for (const coor of shipBlockedCells) {
      if (boardBlockedCells.has(coor)) {
        return true;
      }
    }

    return false;
  }

  // public positionShipOnBoard({
  //   id,
  //   startCoordinate,
  //   direction,
  // }: IPositionShipDto): void {

  // }
}
