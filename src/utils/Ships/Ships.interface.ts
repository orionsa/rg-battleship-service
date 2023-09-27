import { ICoordinate } from '../shared.interface';

export type TSize = 1 | 2 | 3 | 4;
export type TDirection = 'vertical' | 'horizontal';

export interface IShip {
  size: TSize;
  direction: TDirection;
  startCoordinate: ICoordinate;
}

export interface IShipCoordinate extends ICoordinate {
  isHit: boolean;
}
