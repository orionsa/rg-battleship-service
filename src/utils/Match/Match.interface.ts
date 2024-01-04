import { Board } from '../Board/Board';

export interface IPlayer {
  id: string;
  board: Board;
  isReadyToStart: boolean;
}
