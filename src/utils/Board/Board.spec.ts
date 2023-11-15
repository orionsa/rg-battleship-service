import { Board } from './Board';

describe('Board.ts', () => {
  describe('Board constructor', () => {
    it('should create new 10 X 10 matrics (Board)', () => {
      const board = new Board();

      expect(board.rows).toHaveLength(10);
      expect(board.rows.flat()).toHaveLength(100);
    });
  });

  describe('getBlockedCellsByParams method', () => {
    it('getBlockedCellsByParams should return array of surrounding coordiantes', () => {
      const board = new Board();

      const surroundingCells = board.getBlockedCellsByParams({
        startCoordinate: { x: 3, y: 3 },
        direction: 'vertical',
        shipSize: 4,
      });

      expect(surroundingCells.length).toBe(18);
    });

    it('getBlockedCellsByParams should return array of inbound surrounding coordiantes', () => {
      const board = new Board();

      const surroundingCells = board.getBlockedCellsByParams({
        startCoordinate: { x: 0, y: 0 },
        direction: 'vertical',
        shipSize: 1,
      });

      expect(surroundingCells.length).toBe(4);
    });
  });

  describe('getBlockedCells method', () => {
    it('getBlockedCells should return correct blocked cells set', () => {
      const board = new Board();
      const firstShipId = board.fleet.ships[0].id;
      const secondShipId = board.fleet.ships[1].id;
      const firstShipCoor = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      const secondShipCoor = [
        { x: 8, y: 8 },
        { x: 9, y: 8 },
        { x: 8, y: 9 },
        { x: 9, y: 9 },
      ];

      board.shipBlockedCoordinates.set(firstShipId, firstShipCoor);
      board.shipBlockedCoordinates.set(secondShipId, secondShipCoor);
      const blockeCells = board.getBlockedCells(firstShipId);

      expect(
        blockeCells.length === secondShipCoor.length &&
          [...blockeCells].every((element) => secondShipCoor.includes(element)),
      ).toBe(true);
    });
  });

  describe('checkCellsOverlapping method', () => {
    it('should return true for overlapping cells ', () => {
      const board = new Board();

      const firstSet = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ];

      const secondSet = [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ];

      const hasOverlapping = board.checkCellsOverlapping(firstSet, secondSet);
      expect(hasOverlapping).toBe(true);
    });
  });

  describe('positionShipOnBoard method', () => {
    it('should throw error if ship is out of bounds vetically', () => {
      const board = new Board();

      const shipId = board.fleet.ships[0].id;
      const startCoordinate = { x: 9, y: 9 };
      const direction = 'vertical';

      expect(() =>
        board.positionShipOnBoard({ id: shipId, startCoordinate, direction }),
      ).toThrowError();
    });

    it('should throw error if ship is out of bounds horizontally', () => {
      const board = new Board();

      const shipId = board.fleet.ships[9].id;
      const startCoordinate = { x: 6, y: 0 };
      const direction = 'horizontal';

      expect(() =>
        board.positionShipOnBoard({ id: shipId, startCoordinate, direction }),
      ).toThrowError();
    });

    it('should throw error if ship is overlapping with another ship', () => {
      const board = new Board();

      const shipId = board.fleet.ships[0].id;
      const secondShipId = board.fleet.ships[1].id;
      const startCoordinate = { x: 0, y: 0 };
      const secondShipStartCoordinate = { x: 1, y: 1 };
      const direction = 'vertical';

      board.positionShipOnBoard({ id: shipId, startCoordinate, direction }),
        expect(() =>
          board.positionShipOnBoard({
            id: secondShipId,
            startCoordinate: secondShipStartCoordinate,
            direction,
          }),
        ).toThrowError();
    });
  });
});
