import { ICoordinate } from '../shared.interface';

export interface ITile {
  id: string;
  isHit: boolean;
  hasShip: boolean;
  coordinates: ICoordinate;
}

export interface IRow {
  number: number;
  tiles: ITile[];
}

export interface IBoard {
  rows: IRow[];
}
