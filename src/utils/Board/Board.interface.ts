import { ICoordinate } from '../shared.interface';

export interface ICell {
  id: string;
  isHit: boolean;
  hasShip: boolean;
  coordinates: ICoordinate;
}

export interface IRow {
  number: number;
  cells: ICell[];
}

export interface IBoard {
  rows: IRow[];
}
