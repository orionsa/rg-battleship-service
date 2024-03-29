import { Injectable, Logger } from '@nestjs/common';

import { Match } from '../utils/Match/Match';
import { IJoinMatchRes } from './match-manager.interface';
import { IPositionShipDto } from 'src/utils/Fleet/Fleet.interface';
import { getMockMatch } from '../utils/helpers';
import { ICoordinate } from '../utils/shared.interface';

@Injectable()
export class MatchManagerService {
  public manager: Map<string, Match>;
  public currentMatch: string | null;
  constructor() {
    this.manager = new Map();
    this.currentMatch = null;
  }

  private getMatch(id: string): Match | null {
    if (this.manager.has(id)) {
      return this.manager.get(id);
    }

    return null;
  }

  public healthCheck(): Map<string, any> {
    const mock = getMockMatch();
    if (!this.manager.size) {
      this.manager.set(mock.id, mock);
    }

    return this.manager;
  }

  public handleJoinMatch(): Omit<IJoinMatchRes, 'socketId'> {
    if (!this.currentMatch) {
      const match = new Match();
      this.currentMatch = match.id;
      match.joinPlayer();
      this.manager.set(match.id, match);
      return { matchId: match.id, playerId: match.firstPlayer.id };
    }

    const match = this.getMatch(this.currentMatch);
    this.currentMatch = null;
    match.joinPlayer();
    this.manager.set(match.id, match);
    return { matchId: match.id, playerId: match.secondPlayer.id };
  }

  public positionShip(
    matchId: string,
    playerId: string,
    params: IPositionShipDto,
  ): void {
    try {
      const match = this.getMatch(matchId);
      console.log(match);
      match.setShipPosition(playerId, params);
    } catch (error) {
      Logger.error(`[MatchManagerService/positionShip]: ${error}`);
    }
  }

  public setHit(
    matchId: string,
    playerId: string,
    params: ICoordinate,
  ): { hasShip: boolean; opponentId: string } {
    try {
      const match = this.getMatch(matchId);
      const hasShip = match.setHit(playerId, params);
      const opponentId = match.getOpponent(playerId);
      return { hasShip, opponentId };
    } catch (error) {
      Logger.error(`[MatchManagerService/setHit]: ${error}`);
    }
  }

  public removeShipFromBoard(
    matchId: string,
    playerId: string,
    shipId: string,
  ): void {
    const match = this.getMatch(matchId);
    match.removeShipFromBoard(playerId, shipId);
  }

  public setPlayerStatus(
    matchId: string,
    playerId: string,
    status: boolean,
  ): void {
    const match = this.getMatch(matchId);
    match.setPlayerReadyStatus(playerId, status);
  }

  public logBoards(): void {
    console.log('----- Logging Boards -----');
    this.manager.forEach((match) => {
      console.log(`----- ${match.id} -----`);
      console.log(`----- First Board ${match.firstPlayer?.board.id} -----`);
      match?.firstPlayer?.board?.logBoardCellsWithColors();
      console.log(match.firstPlayer?.id);
      console.log('Ships:');
      match?.firstPlayer?.board?.fleet.ships.forEach((s) => console.log(s.id));
      console.log(`----- Second Board ${match.secondPlayer?.board.id} -----`);
      match?.secondPlayer?.board?.logBoardCellsWithColors();
      console.log(match.secondPlayer?.id);
      console.log('Ships:');
      match?.secondPlayer?.board?.fleet.ships.forEach((s) => console.log(s.id));
    });
    console.log('----- End -----');
  }
}
