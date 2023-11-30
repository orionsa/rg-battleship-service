import {
  TDirection,
  TSize,
  IShipCoordinate,
  IShipCellsDto,
} from './Fleet.interface';
import { ICoordinate } from '../shared.interface';
import { BOARD_SIZE } from '../constants';
import { genId } from '../nanoid';

export class Ship {
  private readonly boardSize = BOARD_SIZE;
  id: string;
  size: TSize;
  direction: TDirection | null;
  coordinates: IShipCoordinate[];
  startCoordinate: ICoordinate;
  isPositioned: boolean;

  constructor(size: TSize) {
    if (!size) {
      throw new Error(`[Ship/constructor]: should get size but got ${size}`);
    }
    this.id = genId({ prefix: 'ship_' });
    this.size = size;
    this.direction = null;
    this.coordinates = [];
    this.isPositioned = false;
  }

  get _isSunk(): boolean {
    return this.coordinates.every((coor) => coor.isHit);
  }

  get _isVertical(): boolean {
    return this.direction === 'vertical';
  }

  get _coordinatesMap(): Map<string, boolean> {
    // returns a hashmap of key: x and y string coordinate, value: isHit
    const map = new Map();
    this.coordinates.forEach(({ x, y, isHit }) => {
      map.set(`${x}${y}`, isHit);
    });

    return map;
  }

  static findSurroundingCells({
    startCoordinate,
    size,
    direction,
    boardSize,
  }: IShipCellsDto): ICoordinate[] {
    let coordinates: ICoordinate[] = [];
    const { x, y } = startCoordinate;
    if (direction === 'vertical') {
      for (let i = y - 1; i <= y + size; i++) {
        coordinates.push({ y: i, x: x - 1 }, { y: i, x: x + 1 });
        if (i === y - 1 || i === y + size) {
          coordinates.push({ y: i, x: x });
        }
      }
    } else {
      for (let i = x - 1; i <= x + size; i++) {
        coordinates.push({ x: i, y: y - 1 }, { x: i, y: y + 1 });
        if (i === x - 1 || i === x + size) {
          coordinates.push({ x: i, y: y });
        }
      }
    }

    // filter out of bounds cells
    coordinates = coordinates.filter(
      (coor) =>
        coor.x >= 0 && coor.x < boardSize && coor.y >= 0 && coor.y < boardSize,
    );

    return coordinates;
  }

  static getPredictedShipCoordinates({
    startCoordinate,
    direction,
    size,
  }: IShipCellsDto): ICoordinate[] {
    const coordinates: ICoordinate[] = [];
    const { x, y } = startCoordinate;
    if (direction === 'vertical') {
      for (let i = y; i < y + size; i++) {
        coordinates.push({ y: i, x });
      }
    } else {
      for (let i = x; i < x + size; i++) {
        coordinates.push({ x: i, y });
      }
    }

    return coordinates;
  }

  private setCoordinates(): void {
    for (let i = 0; i < this.size; i++) {
      this.coordinates.push(
        this._isVertical
          ? {
              x: this.startCoordinate.x,
              y: this.startCoordinate.y + i,
              isHit: false,
            }
          : {
              x: this.startCoordinate.x + i,
              y: this.startCoordinate.y,
              isHit: false,
            },
      );
    }
  }

  private validateStartCoordinate(startCoordinate: ICoordinate): void {
    const start = this._isVertical ? startCoordinate.y : startCoordinate.x;
    const isValid = start + this.size <= this.boardSize;
    if (!isValid) {
      throw new Error(
        '[Ship/validateStartCoordinate]: ship coordinates out of bounds',
      );
    }

    this.startCoordinate = startCoordinate;
  }

  public setPosition(
    newStartCoordinate: ICoordinate,
    newDirection?: TDirection,
  ): void {
    if (newDirection) {
      this.direction = newDirection;
    }

    this.validateStartCoordinate(newStartCoordinate);
    this.setCoordinates();
    this.isPositioned = true;
    this.direction = newDirection;
  }

  public setHit(hitCoordinate: ICoordinate): void {
    const index = this.coordinates.findIndex(
      ({ x, y }) => x === hitCoordinate.x && y === hitCoordinate.y,
    );

    if (index === -1) {
      throw new Error(
        `[Ship/setHit]: ship is not on coordinate ${{ ...hitCoordinate }}`,
      );
    }

    this.coordinates[index].isHit = true;
  }

  public unsetPosition() {
    this.direction = null;
    this.coordinates = [];
    this.isPositioned = false;
  }

  public getOwnSurroundingCells(): ICoordinate[] {
    return Ship.findSurroundingCells({
      startCoordinate: this.startCoordinate,
      direction: this.direction,
      size: this.size,
      boardSize: this.boardSize,
    });
  }
}
