import { ICell } from './Board.interface';
import { genId } from '../nanoid';
import { BOARD_SIZE } from '../constants';
import { Fleet } from '../Fleet/Fleet';
import { Ship } from '../Fleet/Ship';
import { ICoordinate } from '../shared.interface';
import { IPositionShipDto } from '../Fleet/Fleet.interface';

export class Board {
  private readonly boardSize = BOARD_SIZE;
  id: string;
  rows: ICell[][];
  fleet: Fleet;
  // blockedCoordinats: Set<ICoordinate>;
  // shipBlockedCoordinates: Map<string, ICoordinate[]>; // key: shipId, value: blocked coordinates

  constructor() {
    this.id = genId({ prefix: 'board_' });
    this.rows = this.initBoard();
    this.fleet = new Fleet();
    // this.shipBlockedCoordinates = new Map();
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
          borderShipIds: [],
        });
      }
    }

    return rows;
  }

  // public getBlockedCellsByParams({
  //   startCoordinate,
  //   direction,
  //   shipSize,
  // }): ICoordinate[] {
  //   /**
  //    * get the cells that will be blocked by a ships position, direction and size
  //    */
  //   let coordinates: ICoordinate[] = [];
  //   const coorToChange = direction === 'vertical' ? 'y' : 'x';
  //   const staticCoor = direction === 'vertical' ? 'x' : 'y';
  //   for (
  //     let i = startCoordinate[staticCoor] - 1;
  //     i <= startCoordinate[staticCoor] + shipSize;
  //     i++
  //   ) {
  //     coordinates.push(
  //       {
  //         [staticCoor]: i,
  //         [coorToChange]: startCoordinate[coorToChange] - 1,
  //       } as unknown as ICoordinate,
  //       {
  //         [staticCoor]: i,
  //         [coorToChange]: startCoordinate[coorToChange],
  //       } as unknown as ICoordinate,
  //       {
  //         [staticCoor]: i,
  //         [coorToChange]: startCoordinate[coorToChange] + 1,
  //       } as unknown as ICoordinate,
  //     );
  //   }

  //   // filter out of bounds cells
  //   coordinates = coordinates.filter(
  //     (coor) =>
  //       coor.x >= 0 &&
  //       coor.x < this.boardSize &&
  //       coor.y >= 0 &&
  //       coor.y < this.boardSize,
  //   );

  //   // return new Set(coordinates);
  //   return coordinates;
  // }

  // public getBlockedCells(shipId: string): ICoordinate[] {
  //   /**
  //    * get all blocked cell beside the ones that are blocked by a specific ship.
  //    */
  //   const mapCopy = new Map(this.shipBlockedCoordinates);
  //   mapCopy.delete(shipId);
  //   const set: ICoordinate[] = [];
  //   mapCopy.forEach((ship) => ship.forEach((coor) => set.push(coor)));
  //   return set;
  // }

  // public checkCellsOverlapping(
  //   shipBlockedCells: ICoordinate[],
  //   boardBlockedCells: ICoordinate[],
  //   // shipSize: number,
  //   // startCoordinate: ICoordinate,
  //   // direction: 'vertical' | 'horizontal',
  // ): boolean | ICoordinate[] {
  //   // console.log('pre shipBlockedCells', shipBlockedCells);
  //   for (const coor of shipBlockedCells) {
  //     if (boardBlockedCells.some((el) => el.x === coor.x && el.y === coor.y)) {
  //       // console.log('coor', coor);
  //       return true;
  //     }
  //   }

  // for (
  //   let i = direction === 'vertical' ? startCoordinate.y : startCoordinate.x;
  //   i < shipSize;
  //   i++
  // ) {
  //   console.log('boardBlockedCells -> ', boardBlockedCells);
  //   if (
  //     boardBlockedCells.some(
  //       (el) =>
  //         el.x === startCoordinate.x + i && el.y === startCoordinate.y + i,
  //     )
  //   ) {
  //     return true;
  //   }
  // }

  //   return false;
  // }

  public positionShipOnBoard({
    id,
    startCoordinate,
    direction,
  }: IPositionShipDto): void {
    const ship = this.fleet.getShip(id);
    const isInBounds =
      direction === 'vertical'
        ? startCoordinate.y + ship.size < this.boardSize
        : startCoordinate.x + ship.size < this.boardSize;

    if (!isInBounds) {
      throw new Error('[Board/positionShipOnBoard]: ship out of bounds');
    }

    const shipParams = {
      startCoordinate,
      direction,
      size: ship.size,
      boardSize: this.boardSize,
    };

    const shipPredictedCells = Ship.getPredictedShipCoordinates(shipParams);

    const isValid = this.validatePredictedShipPosition(shipPredictedCells);
    if (!isValid) {
      throw new Error('[Board/positionShipOnBoard]: ship overlapping');
    }
    const surroundingCells = Ship.findSurroundingCells(shipParams);
    // console.log('surroundingCells -> ', surroundingCells);
    this.setCoordiantesWithShip(shipPredictedCells);
    this.setCoodinatesWithBorderShip(surroundingCells, ship.id);
    ship.setPosition(startCoordinate, direction);
  }

  // public positionShipOnBoard({
  //   id,
  //   startCoordinate,
  //   direction,
  // }: IPositionShipDto): void {
  //   const ship = this.fleet.getShip(id);
  //   const isInBounds =
  //     direction === 'vertical'
  //       ? startCoordinate.y + ship.size < this.boardSize
  //       : startCoordinate.x + ship.size < this.boardSize;

  //   if (!isInBounds) {
  //     throw new Error('[Board/positionShipOnBoard]: ship out of bounds');
  //   }

  //   const shipPredictedCells = Ship.getPredictedShipCoordinates({
  //     startCoordinate,
  //     direction,
  //     size: ship.size,
  //     boardSize: this.boardSize,
  //   });

  //   const shipBlockedCells = this.getBlockedCellsByParams({
  //     startCoordinate,
  //     direction,
  //     shipSize: ship.size,
  //   });

  //   // console.log('shipBlockedCells', shipBlockedCells);
  //   const boardBlockedCells = this.getBlockedCells(id);
  //   // console.log('boardBlockedCells - >', boardBlockedCells);
  //   const isOverlapping = this.checkCellsOverlapping(
  //     // shipBlockedCells,
  //     shipPredictedCells,
  //     boardBlockedCells,
  //     // ship.size,
  //     // startCoordinate,
  //     // direction,
  //   );

  //   if (isOverlapping) {
  //     console.log('shipBlockedCells isOverlapping', shipPredictedCells);
  //     console.log('shipBlockedCells isOverlapping', boardBlockedCells);
  //     throw new Error('[Board/positionShipOnBoard]: ship overlapping');
  //   }

  //   ship.setPosition(startCoordinate, direction);
  //   // console.log('ship -> ', ship);
  //   this.shipBlockedCoordinates.set(id, shipBlockedCells);
  //   for (const coor of ship.coordinates) {
  //     // console.log('coor', coor);
  //     this.rows[coor.x][coor.y].hasShip = true;
  //   }
  // }

  public validatePredictedShipPosition(
    shipCoordinates: ICoordinate[],
  ): boolean {
    for (const coor of shipCoordinates) {
      if (
        this.rows[coor.x][coor.y].hasShip ||
        this.rows[coor.x][coor.y].borderShipIds.length
      ) {
        return false;
      }
    }

    return true;
  }

  private setCoordiantesWithShip(coordinates: ICoordinate[]): void {
    for (const coor of coordinates) {
      this.rows[coor.x][coor.y].hasShip = true;
    }
  }

  private setCoodinatesWithBorderShip(
    coordiantes: ICoordinate[],
    shipId: string,
  ): void {
    for (const coor of coordiantes) {
      this.rows[coor.x][coor.y].borderShipIds.push(shipId);
    }
  }

  public logBoardCellsWithColors(): void {
    const colors = {
      white: '\x1b[37m', // White
      blue: '\x1b[34m', // Blue
      orange: '\x1b[38;5;202m', // Orange
    };
    let board = '';
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        if (this.rows[j][i].hasShip) {
          board += colors.blue + 'X ';
        } else if (this.rows[j][i].borderShipIds.length) {
          board += colors.orange + 'O ';
        } else {
          board += colors.white + 'O ';
        }
      }
      board += '\n';
    }
    console.log(board);
  }
}
