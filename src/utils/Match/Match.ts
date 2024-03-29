import { Board } from '../Board/Board';
import { IPlayer } from './Match.interface';
import { genId } from '../nanoid';
import { ICoordinate } from '../shared.interface';
import { IPositionShipDto } from '../Fleet/Fleet.interface';

export class Match {
  public id: string;
  public firstPlayer: IPlayer | null;
  public secondPlayer: IPlayer | null;
  public isFirstPlayerTurn: boolean;
  public isMatchRunning: boolean;

  constructor() {
    this.id = genId({ prefix: 'match_' });
    this.firstPlayer = null;
    this.secondPlayer = null;
    this.isFirstPlayerTurn = Math.random() < 0.5;
    this.isMatchRunning = false;
  }

  joinPlayer(): void {
    const id = genId({ prefix: 'player_' });
    const board = new Board();
    if (this.firstPlayer && this.secondPlayer) {
      throw new Error('[Match/joinPlayer] two players already set');
    }

    if (!this.firstPlayer) {
      this.firstPlayer = {
        id,
        board,
        isReadyToStart: false,
      };
      return;
    }
    this.secondPlayer = {
      id,
      board,
      isReadyToStart: false,
    };
  }

  public changeTurn(): void {
    this.isFirstPlayerTurn = !this.isFirstPlayerTurn;
  }

  public validateTurnById(id: string): boolean {
    const { id: currentId } = this.isFirstPlayerTurn
      ? this.firstPlayer
      : this.secondPlayer;
    return currentId === id;
  }

  public getPlayer(id: string): IPlayer | null {
    if (this.firstPlayer?.id === id) {
      return this.firstPlayer;
    }

    return this.secondPlayer?.id === id ? this.secondPlayer : null;
  }

  public getIsFirstPlayer(id: string): boolean {
    if (id === this.firstPlayer?.id) {
      return true;
    }

    return false;
  }

  public setHit(playerId: string, coordinates: ICoordinate): boolean {
    if (!this.isMatchRunning) {
      throw new Error('[Match/setHit] match not started');
    }

    const isFirstPlayer = this.getIsFirstPlayer(playerId);
    if (isFirstPlayer !== this.isFirstPlayerTurn) {
      throw new Error('[Match/setHit] not players turn');
    }

    const playerBoard =
      this[isFirstPlayer ? 'secondPlayer' : 'firstPlayer'].board;
    playerBoard.setHit(coordinates);

    return playerBoard.hasShip(coordinates);
  }

  public setShipPosition(playerId: string, params: IPositionShipDto): void {
    if (this.isMatchRunning) {
      throw new Error('[Match/setShipPosition] match already started');
    }
    const isFirstPlayer = this.getIsFirstPlayer(playerId);
    this[
      isFirstPlayer ? 'firstPlayer' : 'secondPlayer'
    ].board.positionShipOnBoard(params);
  }

  public removeShipFromBoard(playerId: string, shipId: string): void {
    if (this.isMatchRunning) {
      throw new Error('[Match/removeShipFromBoard] match already started');
    }
    const player = this.getPlayer(playerId);
    player.board.removeShipFromBoard(shipId);
  }

  public setPlayerReadyStatus(playerId: string, status: boolean): void {
    if (this.isMatchRunning) {
      throw new Error(
        '[Match/setPlayerReadyStatus] unable to change player status after game started',
      );
    }

    const player = this.getPlayer(playerId);
    if (status && !player.board.fleet._isAllPositioned) {
      throw new Error('[Match/setPlayerReadyStatus] not all ships positioned');
    }

    player.isReadyToStart = status;
    this.isMatchRunning =
      this.firstPlayer.isReadyToStart && this.secondPlayer?.isReadyToStart;
  }

  public getOpponent(id: string): string {
    if (this.firstPlayer.id === id) {
      return this.secondPlayer?.id;
    }

    return this.firstPlayer.id;
  }
}
