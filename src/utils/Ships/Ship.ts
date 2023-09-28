import { IShip, TDirection, TSize, IShipCoordinate } from './Ships.interface';
import { ICoordinate } from '../shared.interface';
import { BOARD_SIZE } from '../constants';
import { genId } from '../nanoid';

export class Ship {
  id: string;
  size: TSize;
  direction: TDirection;
  coordinates: IShipCoordinate[];
  startCoordinate: ICoordinate;

  constructor({ size, direction, startCoordinate }: IShip) {
    if (!size || !direction || !startCoordinate) {
      throw new Error(
        `[Ship/constructor]: should get to following params: \n 
        size, direction, startCoordinate but got ${size}, ${direction}, ${startCoordinate}`,
      );
    }
    this.id = genId({ prefix: 'ship_' });
    this.size = size;
    this.direction = direction;
    this.coordinates = [];
    this.validateStartCoordinate(startCoordinate);
    this.setCoordinates();
  }

  get _isSunk() {
    return this.coordinates.every((coor) => coor.isHit);
  }

  get _isVertical() {
    return this.direction === 'vertical';
  }

  private setCoordinates = (): void => {
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
  };

  private validateStartCoordinate = (startCoordinate: ICoordinate): void => {
    const start = this._isVertical ? startCoordinate.y : startCoordinate.x;
    const isValid = start + this.size <= BOARD_SIZE;
    if (!isValid) {
      throw new Error(
        '[Ship/validateStartCoordinate]: ship coordinates out of bounds',
      );
    }

    this.startCoordinate = startCoordinate;
  };

  public changePosition = (
    newStartCoordinate: ICoordinate,
    newDirection?: TDirection,
  ): void => {
    if (newDirection) {
      this.direction = newDirection;
    }

    this.validateStartCoordinate(newStartCoordinate);
    this.setCoordinates();
  };

  public setHit = (hitCoordinate: ICoordinate): void => {
    const index = this.coordinates.findIndex(
      ({ x, y }) => x === hitCoordinate.x && y === hitCoordinate.y,
    );

    if (index === -1) {
      throw new Error(
        `[Ship/setHit]: ship is not on coordinate ${{ ...hitCoordinate }}`,
      );
    }

    this.coordinates[index].isHit = true;
  };

  public findSurroundingCells = (): ICoordinate[] => {
    let coordinates: ICoordinate[] = [];
    const { x, y } = this.startCoordinate;
    if (this._isVertical) {
      for (let i = y - 1; i <= y + this.size; i++) {
        coordinates.push({ y: i, x: x - 1 }, { y: i, x: x + 1 });
        if (i === y - 1 || i === y + this.size) {
          coordinates.push({ y: i, x: x });
        }
      }
    } else {
      for (let i = x - 1; i <= x + this.size; i++) {
        coordinates.push({ x: i, y: y - 1 }, { x: i, y: y + 1 });
        if (i === x - 1 || i === x + this.size) {
          coordinates.push({ x: i, y: x });
        }
      }
    }

    // filter out of bounds cells
    coordinates = coordinates.filter(
      (coor) =>
        coor.x >= 0 &&
        coor.x < BOARD_SIZE &&
        coor.y >= 0 &&
        coor.y < BOARD_SIZE,
    );

    return coordinates;
  };
}
