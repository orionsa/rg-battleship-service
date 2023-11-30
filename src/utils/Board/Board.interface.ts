import { ICoordinate } from '../shared.interface';

export interface ICell {
  id: string;
  isHit: boolean;
  hasShip: boolean;
  coordinates: ICoordinate;
  borderShipIds: string[];
}
