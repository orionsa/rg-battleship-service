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

      expect(surroundingCells.size).toBe(18);
    });

    it('getBlockedCellsByParams should return array of inbound surrounding coordiantes', () => {
      const board = new Board();

      const surroundingCells = board.getBlockedCellsByParams({
        startCoordinate: { x: 0, y: 0 },
        direction: 'vertical',
        shipSize: 1,
      });

      expect(surroundingCells.size).toBe(4);
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
      const secondSet = new Set(secondShipCoor);

      expect(
        blockeCells.size === secondSet.size &&
          [...blockeCells].every((element) => secondSet.has(element)),
      ).toBe(true);
    });
  });
});
