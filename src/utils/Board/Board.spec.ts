import { ICoordinate } from '../shared.interface';
import { Board } from './Board';

describe('Board.ts', () => {
  describe('Board constructor', () => {
    it('should create new 10 X 10 matrics (Board)', () => {
      const board = new Board();

      expect(board.rows).toHaveLength(10);
      expect(board.rows.flat()).toHaveLength(100);
    });

    it('should create new 10 X 10 matrics trackingBoard on Board class', () => {
      const board = new Board();

      expect(board.trackingBoard).toHaveLength(10);
      expect(board.trackingBoard.flat()).toHaveLength(100);
    });
  });

  describe('positionShipOnBoard method', () => {
    it('should position ship on board and set its border with correct id', () => {
      const board = new Board();
      const ship = board.fleet.ships[4];
      const startCoordinate = { x: 1, y: 1 };
      const direction = 'vertical';

      expect(ship.isPositioned).toBe(false);
      board.positionShipOnBoard({ id: ship.id, startCoordinate, direction });
      expect(ship.isPositioned).toBe(true);
      expect(board.rows[1][1].shipId).toBe(ship.id);
      expect(board.rows[1][2].shipId).toBe(ship.id);
      expect(board.rows[0][0].borderShipIds[0]).toBe(ship.id);
    });

    it('should position two 1 tile ships and populate borderShipId with both of the ids', () => {
      const board = new Board();
      const firstShip = board.fleet.ships[0];
      const secondShip = board.fleet.ships[1];
      const direction = 'horizontal';
      board.positionShipOnBoard({
        id: firstShip.id,
        startCoordinate: { x: 0, y: 0 },
        direction,
      });

      board.positionShipOnBoard({
        id: secondShip.id,
        startCoordinate: { x: 2, y: 0 },
        direction,
      });

      expect(board.rows[1][0].borderShipIds).toHaveLength(2);
      expect(board.rows[1][1].borderShipIds).toHaveLength(2);

      expect(board.rows[1][0].borderShipIds).toContain(firstShip.id);
      expect(board.rows[1][0].borderShipIds).toContain(secondShip.id);
      expect(board.rows[1][1].borderShipIds).toContain(firstShip.id);
      expect(board.rows[1][1].borderShipIds).toContain(secondShip.id);
    });

    it('should throw error if ship is out of bounds vetically', () => {
      const board = new Board();

      const shipId = board.fleet.ships[4].id;
      const startCoordinate = { x: 9, y: 9 };
      const direction = 'vertical';

      expect(() =>
        board.positionShipOnBoard({ id: shipId, startCoordinate, direction }),
      ).toThrowError();
    });

    it('should throw error if ship is out of bounds horizontally', () => {
      const board = new Board();

      const shipId = board.fleet.ships[9].id;
      const startCoordinate = { x: 7, y: 0 };
      const direction = 'horizontal';
      expect(() => {
        board.positionShipOnBoard({ id: shipId, startCoordinate, direction });
      }).toThrowError();
    });

    it('should throw error if ship is overlapping with another ship', () => {
      const board = new Board();

      const shipId = board.fleet.ships[0].id;
      const secondShipId = board.fleet.ships[1].id;
      const startCoordinate = { x: 0, y: 0 };
      const secondShipStartCoordinate = { x: 1, y: 1 };
      const direction = 'vertical';

      board.positionShipOnBoard({ id: shipId, startCoordinate, direction }),
        expect(() => {
          board.positionShipOnBoard({
            id: secondShipId,
            startCoordinate: secondShipStartCoordinate,
            direction,
          });
        }).toThrowError();
    });

    it('should reposition ship if already positioned', () => {
      const board = new Board();
      const shipId = board.fleet.ships[9].id;
      board.positionShipOnBoard({
        id: shipId,
        startCoordinate: { x: 1, y: 2 },
        direction: 'vertical',
      });

      expect(board.fleet.ships[9].direction).toBe('vertical');
      board.positionShipOnBoard({
        id: shipId,
        startCoordinate: { x: 1, y: 2 },
        direction: 'horizontal',
      });
      expect(board.fleet.ships[9].direction).toBe('horizontal');
    });
  });

  describe('validatePredictedShipPosition method', () => {
    it('should return true for valid position', () => {
      const board = new Board();
      const shipCoordinates: ICoordinate[] = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ];

      const isValid = board.validatePredictedShipPosition(shipCoordinates);

      expect(isValid).toBe(true);
    });

    it('should return false if predicted coordinates has a ship on it', () => {
      const board = new Board();
      const shipCoordinates = [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      board.rows[1][1].shipId = 'someshipId';

      const isValid = board.validatePredictedShipPosition(shipCoordinates);
      expect(isValid).toBe(false);
    });

    it('should return false if predicted coordinates has a border of ship on it', () => {
      const board = new Board();
      const borderShipCoordinates = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 0 },
      ]; // borders for ship of size 1 positioned on { x:0, y: 0 }

      const shipCoordinates = [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ];

      for (const coor of borderShipCoordinates) {
        const { x, y } = coor;
        board.rows[x][y].borderShipIds.push(board.fleet.ships[0].id);
      }

      const isValid = board.validatePredictedShipPosition(shipCoordinates);
      expect(isValid).toBe(false);
    });
  });

  describe('removeShipFromBoard method', () => {
    const board = new Board();
    const ship = board.fleet.ships[0];

    board.positionShipOnBoard({
      id: ship.id,
      startCoordinate: { x: 0, y: 0 },
      direction: 'vertical',
    });

    expect(board.rows[0][0].shipId).toBe(ship.id);
    expect(board.rows[0][1].borderShipIds).toContain(ship.id);

    board.removeShipFromBoard(ship.id);
    expect(ship.isPositioned).toBe(false);
    expect(board.rows[0][0].shipId).toBe(null);
    expect(board.rows[0][1].borderShipIds).not.toContain(ship.id);
  });

  describe('setHit method', () => {
    it('should set specific cell isHit flag to true', () => {
      const board = new Board();

      expect(board.rows[0][0].isHit).toBe(false);
      board.setHit({ x: 0, y: 0 });
      expect(board.rows[0][0].isHit).toBe(true);
    });

    it('should set specific cell isHit flag to true and call ship.setHit with correct params', () => {
      const board = new Board();
      const ship = board.fleet.ships[0];
      const stub = jest.spyOn(ship, 'setHit');

      board.positionShipOnBoard({
        id: ship.id,
        startCoordinate: { x: 0, y: 0 },
        direction: 'horizontal',
      });

      expect(board.rows[0][0].isHit).toBe(false);
      board.setHit({ x: 0, y: 0 });
      expect(board.rows[0][0].isHit).toBe(true);
      expect(stub).toBeCalledWith({ x: 0, y: 0 });
      stub.mockRestore();
    });

    it('should throw an error if setHit is called on an already hit cell', () => {
      const board = new Board();
      board.setHit({ x: 0, y: 0 });
      expect(() => {
        board.setHit({ x: 0, y: 0 });
      }).toThrowError();
    });

    it('shoule set specific cell on trackingBoard setHitFlag to true', () => {
      const board = new Board();

      expect(board.trackingBoard[0][0].isHit).toBe(false);
      board.setHit({ x: 0, y: 0 });
      expect(board.trackingBoard[0][0].isHit).toBe(true);
    });

    it('should set this.trackingBoard specific cell isHit flag to true and change hasShip flag to true', () => {
      const board = new Board();
      const ship = board.fleet.ships[0];

      board.positionShipOnBoard({
        id: ship.id,
        startCoordinate: { x: 0, y: 0 },
        direction: 'horizontal',
      });

      expect(board.trackingBoard[0][0].isHit).toBe(false);
      expect(board.trackingBoard[0][0].isHit).toBe(false);
      board.setHit({ x: 0, y: 0 });
      expect(board.trackingBoard[0][0].isHit).toBe(true);
      expect(board.trackingBoard[0][0].isHit).toBe(true);
    });
  });

  describe('hasShip method', () => {
    it('should return true if cell has ship', () => {
      const board = new Board();

      const ship = board.fleet.ships[0];

      board.positionShipOnBoard({
        id: ship.id,
        startCoordinate: { x: 0, y: 0 },
        direction: 'horizontal',
      });

      const hasShip = board.hasShip({ x: 0, y: 0 });
      expect(hasShip).toBe(true);
    });

    it('should return false if cell has no ship', () => {
      const board = new Board();

      const hasShip = board.hasShip({ x: 0, y: 0 });
      expect(hasShip).toBe(false);
    });
  });

  describe('logBoard method', () => {
    it('should log board with ships', () => {
      const positions = [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 4, y: 0 },
        { x: 6, y: 0 },
        { x: 0, y: 2 },
        { x: 3, y: 2 },
        { x: 6, y: 2 },
        { x: 0, y: 4 },
        { x: 4, y: 4 },
        { x: 0, y: 6 },
      ];

      function positionShips(board: Board) {
        positions.forEach((position, index) => {
          const shipId = board.fleet.ships[index].id;
          board.positionShipOnBoard({
            id: shipId,
            startCoordinate: position,
            direction: 'horizontal',
          });
        });
      }
      const board = new Board();
      positionShips(board);
      board.setHit({ x: 4, y: 4 });
      board.setHit({ x: 9, y: 9 });
      board.logBoardCellsWithColors();
    });
  });
});
