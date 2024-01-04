import { IPositionShipDto } from '../utils/Fleet/Fleet.interface';
import { ICoordinate } from 'src/utils/shared.interface';

export type TActionType =
  | 'joinMatch'
  | 'positionShip'
  | 'setHit'
  | 'removeShip'
  | 'setPlayerStatus';
export type TDevActionType =
  | 'devClearMatches'
  | 'devLogMatches'
  | 'devLogBoards';

export interface IMatchPayload {
  action: TActionType | TDevActionType;
  matchId: string;
  playerId: string;
  payload?: IPositionShipDto | ICoordinate | string | boolean;
}

export interface IJoinMatchRes {
  socketId: string;
  matchId: string;
  playerId: string;
}
