import { ICoordinate } from '../shared.interface';

export interface ICell {
  id: string;
  isHit: boolean;
  shipId: null | string;
  coordinates: ICoordinate;
  borderShipIds: string[];
}
