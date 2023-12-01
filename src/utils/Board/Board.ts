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

  constructor() {
    this.id = genId({ prefix: 'board_' });
    this.rows = this.initBoard();
    this.fleet = new Fleet();
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

  private setCoordiantesWithShip(coordinates: ICoordinate[]): void {
    for (const coor of coordinates) {
      const { x, y } = coor;
      this.rows[x][y].hasShip = true;
    }
  }

  private setCoodinatesWithBorderShip(
    coordiantes: ICoordinate[],
    shipId: string,
  ): void {
    for (const coor of coordiantes) {
      const { x, y } = coor;
      this.rows[x][y].borderShipIds.push(shipId);
    }
  }

  private removeShipCoordinates(coordiantes: ICoordinate[]) {
    for (const coor of coordiantes) {
      const { x, y } = coor;
      this.rows[x][y].hasShip = false;
    }
  }

  private removeShipIdFromCell(
    coordiantes: ICoordinate[],
    shipId: string,
  ): void {
    for (const coor of coordiantes) {
      const { x, y } = coor;
      this.rows[x][y].borderShipIds = this.rows[x][y].borderShipIds.filter(
        (id) => id !== shipId,
      );
    }
  }

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
    this.setCoordiantesWithShip(shipPredictedCells);
    this.setCoodinatesWithBorderShip(surroundingCells, ship.id);
    ship.setPosition(startCoordinate, direction);
  }

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

  public removeShipFromBoard(shipId) {
    const isValidShipId = this.fleet.validateShipById(shipId);
    if (!isValidShipId) {
      throw new Error('[Board/removeShipFromBoard]: invalid ship id');
    }

    const ship = this.fleet.getShip(shipId);
    this.removeShipCoordinates(ship.coordinates);
    const surroundingCells = ship.getOwnSurroundingCells();
    this.removeShipIdFromCell(surroundingCells, ship.id);
    ship.unsetPosition();
  }

  public logBoardCellsWithColors(): void {
    /**
     * helper function for develpment purpose,
     * will be removed after development is done
     */
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
