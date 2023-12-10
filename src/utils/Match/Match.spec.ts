import { Match } from './Match';

describe('Match.ts', () => {
  describe('Match constructor', () => {
    it('should initiate Match class with players set to null and turn flag with boolean value', () => {
      const match = new Match();

      expect(match.firstPlayer).toBe(null);
      expect(match.secondPlayer).toBe(null);
      expect(typeof match.isFirstPlayerTurn === 'boolean').toBe(true);
    });
  });

  describe('changeTurn method', () => {
    it('changeTurn method should toggle flag', () => {
      const match = new Match();

      match.isFirstPlayerTurn = true;
      match.changeTurn();
      expect(match.isFirstPlayerTurn).toBe(false);
      match.changeTurn();
      expect(match.isFirstPlayerTurn).toBe(true);
    });
  });

  describe('joinPlayer method', () => {
    it('should set first player on first joinPlayer call', () => {
      const match = new Match();
      match.joinPlayer();

      expect(match.firstPlayer).not.toBe(null);
      expect(match.secondPlayer).toBe(null);
    });

    it('should set second player on second joinPlayer call', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      expect(match.firstPlayer).not.toBe(null);
      expect(match.secondPlayer).not.toBe(null);
    });

    it('should throw an error if try to set more then two players', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      expect(() => {
        match.joinPlayer();
      }).toThrowError();
    });
  });

  describe('validateTurnById', () => {
    it('should return true for correct id validation', () => {
      const match = new Match();
      match.joinPlayer();

      const firstPlayerId = match.firstPlayer.id;
      match.isFirstPlayerTurn = true;

      const isValid = match.validateTurnById(firstPlayerId);
      expect(isValid).toBe(true);
    });

    it('should return false for incorrect id validation', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      const firstPlayerId = match.firstPlayer.id;
      match.isFirstPlayerTurn = false;

      const isValid = match.validateTurnById(firstPlayerId);
      expect(isValid).toBe(false);
    });
  });

  describe('getPlayer method', () => {
    it('should return the correct player', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      const { id: firstId } = match.firstPlayer;
      const { id: secondId } = match.secondPlayer;
      const firstPlayer = match.getPlayer(firstId);
      const secondPlayer = match.getPlayer(secondId);

      expect(firstPlayer.id).toEqual(firstId);
      expect(secondPlayer.id).toEqual(secondId);
    });
  });
});
