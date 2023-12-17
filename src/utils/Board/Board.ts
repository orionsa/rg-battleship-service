import { IBoardCell, ITrackingBoardCell } from './Board.interface';
import { genId } from '../nanoid';
import { BOARD_SIZE } from '../constants';
import { Fleet } from '../Fleet/Fleet';
import { Ship } from '../Fleet/Ship';
import { ICoordinate } from '../shared.interface';
import { IPositionShipDto } from '../Fleet/Fleet.interface';

export class Board {
  private readonly boardSize = BOARD_SIZE;
  id: string;
  rows: IBoardCell[][];
  fleet: Fleet;
  trackingBoard: ITrackingBoardCell[][];

  constructor() {
    this.id = genId({ prefix: 'board_' });
    this.initBoard();
    this.fleet = new Fleet();
  }

  private initBoard(): void {
    this.rows = [];
    this.trackingBoard = [];
    for (let i = 0; i < this.boardSize; i++) {
      this.rows[i] = [];
      this.trackingBoard[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.rows[i].push({
          id: `bc_${i}${j}`,
          coordinates: { x: i, y: j },
          isHit: false,
          shipId: null,
          borderShipIds: [],
        });

        this.trackingBoard[i].push({
          id: `tc_${i}${j}`,
          coordinates: { x: i, y: j },
          isHit: false,
          hasShip: false,
        });
      }
    }
  }

  private setCoordiantesWithShip(coordinates: ICoordinate[], shipId): void {
    for (const coor of coordinates) {
      const { x, y } = coor;
      this.rows[x][y].shipId = shipId;
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
      this.rows[x][y].shipId = null;
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
        ? startCoordinate.y + ship.size <= this.boardSize
        : startCoordinate.x + ship.size <= this.boardSize;

    if (ship.isPositioned) {
      this.removeShipFromBoard(ship.id);
    }

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
    this.setCoordiantesWithShip(shipPredictedCells, ship.id);
    this.setCoodinatesWithBorderShip(surroundingCells, ship.id);
    ship.setPosition(startCoordinate, direction);
  }

  public validatePredictedShipPosition(
    shipCoordinates: ICoordinate[],
  ): boolean {
    for (const coor of shipCoordinates) {
      if (
        this.rows[coor.x][coor.y].shipId ||
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

  public setHit(coordinate: ICoordinate): void {
    /**
     * mark cell as hit on both rows and tracking board.
     */
    const { x, y } = coordinate;
    if (this.rows[x][y].isHit) {
      throw new Error(
        `[Board/setHit] coordinate: {x:${x}, y: ${y}} has already been hit`,
      );
    }

    this.rows[x][y].isHit = true;
    this.trackingBoard[x][y].isHit = true;
    if (this.rows[x][y].shipId) {
      const ship = this.fleet.getShip(this.rows[x][y].shipId);
      this.trackingBoard[x][y].hasShip = true;
      ship.setHit({ x, y });
    }
    return;
  }

  public logBoardCellsWithColors(): void {
    /**
     * helper function for develpment purpose,
     * will be removed after development is done
     */
    const colors = {
      white: '\x1b[37m',
      blue: '\x1b[34m',
      orange: '\x1b[38;5;202m',
      grey: '\x1b[90m',
    };
    let board = '';
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.rows[i].length; j++) {
        const char = this.rows[j][i].shipId ? 'X ' : 'O ';
        if (this.rows[j][i].isHit) {
          board += colors.orange + char;
        } else if (this.rows[j][i].shipId) {
          board += colors.blue + char;
        } else if (this.rows[j][i].borderShipIds.length) {
          board += colors.grey + char;
        } else {
          board += colors.white + char;
        }
      }
      board += '\n';
    }
    console.log(board);
  }
}
