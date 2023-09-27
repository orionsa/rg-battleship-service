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

  private setCoordinates = (): void => {
    for (let i = 0; i < this.size; i++) {
      this.coordinates.push(
        this.direction === 'vertical'
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
    const start =
      this.direction === 'vertical' ? startCoordinate.y : startCoordinate.x;
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
}
