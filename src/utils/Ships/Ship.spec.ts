import { Ship } from './Ship';

describe('Ship.ts', () => {
  describe('Ship constructor', () => {
    it('should create new Ship instance', () => {
      const ship = new Ship({
        size: 2,
        direction: 'vertical',
        startCoordinate: { x: 0, y: 0 },
      });

      expect(ship).toBeInstanceOf(Ship);
    });
  });

  describe('setHit method', () => {
    it('setHit should change coordinate status to hit', () => {
      const ship = new Ship({
        size: 2,
        direction: 'vertical',
        startCoordinate: { x: 0, y: 0 },
      });

      ship.setHit({ x: 0, y: 1 });
      expect(ship.coordinates[1].isHit).toBe(true);
    });
  });

  describe('findSurroundingCells method', () => {
    it('findSurroundingCells should return array of surrounding coordiantes', () => {
      const ship = new Ship({
        size: 4,
        direction: 'vertical',
        startCoordinate: { x: 3, y: 3 },
      });
      const surroundingCells = ship.findSurroundingCells();

      expect(surroundingCells).toHaveLength(14);
    });

    it('findSurroundingCells should return array of inbound surrounding coordiantes', () => {
      const ship = new Ship({
        size: 1,
        direction: 'horizontal',
        startCoordinate: { x: 0, y: 0 },
      });

      const surroundingCells = ship.findSurroundingCells();
      expect(surroundingCells).toHaveLength(3);
    });
  });
});
