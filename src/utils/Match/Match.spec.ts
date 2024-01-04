import { Match } from './Match';

import { IPositionShipDto } from '../Fleet/Fleet.interface';

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

  describe('getIsFirstPlayer method', () => {
    it('should return true if the input id is the id of the firstPlayer', () => {
      const match = new Match();
      match.joinPlayer();
      const isFirstPlayer = match.getIsFirstPlayer(match.firstPlayer.id);

      expect(isFirstPlayer).toBe(true);
    });

    it('should return false if the input id is the id of the secondPlayer', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();
      const isFirstPlayer = match.getIsFirstPlayer(match.secondPlayer.id);

      expect(isFirstPlayer).toBe(false);
    });
  });

  describe('setHit method', () => {
    it('should setHit on the secondPlayer board if first player calls setHit', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();
      match.isFirstPlayerTurn = true;

      const stub = jest.spyOn(match.secondPlayer.board, 'setHit');
      const coor = { x: 0, y: 0 };
      match.setHit(match.firstPlayer.id, coor);
      expect(stub).toBeCalledWith(coor);
      stub.mockRestore();
    });

    it('should setHit on the firstPlayer board if second player calls setHit', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();
      match.isFirstPlayerTurn = false;

      const stub = jest.spyOn(match.firstPlayer.board, 'setHit');
      const coor = { x: 0, y: 0 };
      match.setHit(match.secondPlayer.id, coor);
      expect(stub).toBeCalledWith(coor);
      stub.mockRestore();
    });

    it('should throw an Error if player is trying to set hit not on his turn', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();
      match.isFirstPlayerTurn = false;
      expect(() => {
        match.setHit(match.firstPlayer.id, { x: 0, y: 0 });
      }).toThrowError();
    });
  });

  describe('setShipPosition method', () => {
    it('set ship position on first player', () => {
      const match = new Match();
      match.joinPlayer();
      const firstPlayerId = match.firstPlayer.id;
      const params: IPositionShipDto = {
        id: match.firstPlayer.board.fleet.ships[0].id,
        startCoordinate: { x: 3, y: 4 },
        direction: 'vertical',
      };

      expect(match.firstPlayer.board.fleet.ships[0].isPositioned).toBe(false);
      match.setShipPosition(firstPlayerId, params);
      expect(match.firstPlayer.board.fleet.ships[0].isPositioned).toBe(true);
    });

    it('set ship position on second player', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      const secondPlayerId = match.secondPlayer.id;
      const params: IPositionShipDto = {
        id: match.secondPlayer.board.fleet.ships[0].id,
        startCoordinate: { x: 2, y: 2 },
        direction: 'vertical',
      };

      expect(match.secondPlayer.board.fleet.ships[0].isPositioned).toBe(false);
      match.setShipPosition(secondPlayerId, params);
      expect(match.secondPlayer.board.fleet.ships[0].isPositioned).toBe(true);
    });
  });
  describe('removeShipFromBoard method', () => {
    it('should unset ship position', () => {
      const match = new Match();
      match.joinPlayer();

      const playerId = match.firstPlayer.id;
      const shipId = match.firstPlayer.board.fleet.ships[0].id;
      const params: IPositionShipDto = {
        id: shipId,
        startCoordinate: { x: 2, y: 2 },
        direction: 'vertical',
      };

      match.setShipPosition(playerId, params);
      expect(match.firstPlayer.board.fleet.ships[0].isPositioned).toBe(true);
      match.removeShipFromBoard(playerId, shipId);
      expect(match.firstPlayer.board.fleet.ships[0].isPositioned).toBe(false);
    });
  });
});
