import { ICoordinate } from '../shared.interface';

export type TSize = 1 | 2 | 3 | 4;
export type TDirection = 'vertical' | 'horizontal';

export interface IShipCoordinate extends ICoordinate {
  isHit: boolean;
}

export interface IPositionShipDto {
  id: string;
  startCoordinate: ICoordinate;
  direction: TDirection;
}

export interface IShipCellsDto {
  startCoordinate: ICoordinate;
  direction: TDirection;
  size: TSize;
  boardSize: number;
}
