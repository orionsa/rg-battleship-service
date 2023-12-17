import { Match } from './Match/Match';

export const getMockMatch = (): Match => {
  /**
   * this method is used for development purpose,
   * it initiate new match with hard coded ids
   */
  const match = new Match();
  match.joinPlayer();
  match.joinPlayer();
  match.id = 'match_mockId';
  match!.firstPlayer!.id = 'player_first';
  match!.secondPlayer!.id = 'player_second';
  match!.firstPlayer!.board.id = 'board_first';
  match!.secondPlayer!.board.id = 'board_second';
  match!.firstPlayer!.board.fleet.id = 'fleet_first';
  match!.secondPlayer!.board.fleet.id = 'fleet_second';
  for (let i = 0; i < match!.firstPlayer!.board.fleet.ships.length; i++) {
    match!.firstPlayer!.board.fleet.ships[i].id = `ship_F_size_${
      match!.firstPlayer!.board.fleet.ships[i].size
    }_${i}`;
  }
  for (let i = 0; i < match!.secondPlayer!.board.fleet.ships.length; i++) {
    match!.secondPlayer!.board.fleet.ships[i].id = `ship_S_size_${
      match!.secondPlayer!.board.fleet.ships[i].size
    }_${i}`;
  }

  return match;
};
