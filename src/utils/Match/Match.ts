import { Board } from '../Board/Board';
import { IPlayer } from './Match.interface';
import { genId } from '../nanoid';
import { ICoordinate } from '../shared.interface';

export class Match {
  public id: string;
  public firstPlayer: IPlayer | null;
  public secondPlayer: IPlayer | null;
  public isFirstPlayerTurn: boolean;

  constructor() {
    this.id = genId({ prefix: 'match_' });
    this.firstPlayer = null;
    this.secondPlayer = null;
    this.isFirstPlayerTurn = Math.random() < 0.5;
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
      };
      return;
    }
    this.secondPlayer = {
      id,
      board,
    };
  }

  changeTurn(): void {
    this.isFirstPlayerTurn = !this.isFirstPlayerTurn;
  }

  validateTurnById(id: string): boolean {
    const { id: currentId } = this.isFirstPlayerTurn
      ? this.firstPlayer
      : this.secondPlayer;
    return currentId === id;
  }

  getPlayer(id: string): IPlayer | null {
    if (this.firstPlayer?.id === id) {
      return this.firstPlayer;
    }

    return this.secondPlayer?.id === id ? this.secondPlayer : null;
  }

  getIsFirstPlayer(id: string): boolean {
    if (id === this.firstPlayer?.id) {
      return true;
    }

    return false;
  }

  setHit(playerId: string, coordinates: ICoordinate): void {
    const isFirstPlayer = this.getIsFirstPlayer(playerId);
    if (isFirstPlayer !== this.isFirstPlayerTurn) {
      throw new Error('[Match/setHit] not players turn');
    }

    this[isFirstPlayer ? 'secondPlayer' : 'firstPlayer'].board.setHit(
      coordinates,
    );
  }
}