import { ICoordinate } from '../shared.interface';

export interface ICell {
  id: string;
  isHit: boolean;
  coordinates: ICoordinate;
}

export interface IBoardCell extends ICell {
  shipId: null | string;
  borderShipIds: string[];
}

export interface ITrackingBoardCell extends ICell {
  hasShip: boolean;
}
