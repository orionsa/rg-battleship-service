import { ICoordinate } from '../shared.interface';

export type TSize = 1 | 2 | 3 | 4;
export type TDirection = 'vertical' | 'horizontal';

// export interface IShipInit {
//   size: TSize;
//   direction: TDirection;
//   // startCoordinate: ICoordinate;
// }

export interface IShipCoordinate extends ICoordinate {
  isHit: boolean;
}

export type TFleetItem = {
  isPositioned: boolean;
};

export interface IPositionShipDto {
  id: string;
  startCoordinate: ICoordinate;
  direction: TDirection;
}
