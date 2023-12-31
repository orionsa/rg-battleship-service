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
      match.isMatchRunning = true;
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
      match.isMatchRunning = true;
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
      match.isMatchRunning = true;
      expect(() => {
        match.setHit(match.firstPlayer.id, { x: 0, y: 0 });
      }).toThrowError('[Match/setHit] not players turn');
    });

    it('should throw an Error if trying to setHit before match started', () => {
      const match = new Match();
      match.joinPlayer();
      match.isFirstPlayerTurn = true;
      expect(() => {
        match.setHit(match.firstPlayer.id, { x: 0, y: 0 });
      }).toThrowError('[Match/setHit] match not started');
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

    it('should throw an error if trying to set position after match started', () => {
      const match = new Match();
      match.joinPlayer();
      const firstPlayerId = match.firstPlayer.id;
      const params: IPositionShipDto = {
        id: match.firstPlayer.board.fleet.ships[0].id,
        startCoordinate: { x: 3, y: 4 },
        direction: 'vertical',
      };
      match.isMatchRunning = true;

      expect(() => {
        match.setShipPosition(firstPlayerId, params);
      }).toThrowError();
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

    it('should throw an error if trying to remove position after match started', () => {
      const match = new Match();
      match.joinPlayer();
      const firstPlayerId = match.firstPlayer.id;
      const params: IPositionShipDto = {
        id: match.firstPlayer.board.fleet.ships[0].id,
        startCoordinate: { x: 3, y: 4 },
        direction: 'vertical',
      };
      match.setShipPosition(firstPlayerId, params);

      match.isMatchRunning = true;

      expect(() => {
        match.removeShipFromBoard(
          firstPlayerId,
          match.firstPlayer.board.fleet.ships[0].id,
        );
      }).toThrowError();
    });
  });

  describe('setPlayerReadyStatus method', () => {
    it('should set first player status to ready', () => {
      const match = new Match();
      match.joinPlayer();

      const playerId = match.firstPlayer.id;
      expect(match.firstPlayer.isReadyToStart).toBe(false);
      match.firstPlayer.board.fleet.ships.forEach(
        (s) => (s.isPositioned = true),
      );
      match.setPlayerReadyStatus(playerId, true);
      expect(match.firstPlayer.isReadyToStart).toBe(true);
    });

    it('should set second player status to ready', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      const playerId = match.secondPlayer.id;
      expect(match.secondPlayer.isReadyToStart).toBe(false);
      match.secondPlayer.board.fleet.ships.forEach(
        (s) => (s.isPositioned = true),
      );
      match.setPlayerReadyStatus(playerId, true);
      expect(match.secondPlayer.isReadyToStart).toBe(true);
    });

    it('should change match.isMatchRunning flag to true if both players are ready', () => {
      const match = new Match();
      match.joinPlayer();
      match.joinPlayer();

      const firstPlayerId = match.firstPlayer.id;
      const secondPlayerId = match.secondPlayer.id;
      expect(match.isMatchRunning).toBe(false);
      match.firstPlayer.board.fleet.ships.forEach(
        (s) => (s.isPositioned = true),
      );
      match.secondPlayer.board.fleet.ships.forEach(
        (s) => (s.isPositioned = true),
      );
      match.setPlayerReadyStatus(firstPlayerId, true);
      match.setPlayerReadyStatus(secondPlayerId, true);
      expect(match.isMatchRunning).toBe(true);
    });

    it('should throw an error if try to change status after game started', () => {
      const match = new Match();
      match.joinPlayer();
      match.isMatchRunning = true;
      expect(() => {
        match.setPlayerReadyStatus(match.firstPlayer.id, false);
      }).toThrowError();
    });

    it('should throw an error if try to change status to true and not all ships are positioned', () => {
      const match = new Match();
      match.joinPlayer();

      expect(() => {
        match.setPlayerReadyStatus(match.firstPlayer.id, true);
      }).toThrowError();
    });
  });
});
