import { Ship } from './Ship';

describe('Ship.ts', () => {
  describe('Ship constructor', () => {
    it('should create new Ship instance', () => {
      const ship = new Ship(2);

      expect(ship).toBeInstanceOf(Ship);
    });
  });

  describe('_coordinatesMap getter', () => {
    it('should return a has map with hits ', () => {
      const ship = new Ship(2);
      ship.setPosition({ x: 0, y: 0 }, 'vertical');
      const map = ship._coordinatesMap;

      expect(map.size).toBe(2);
    });
  });

  describe('setPosition method', () => {
    const ship = new Ship(2);

    expect(ship.isPositioned).toBe(false);

    ship.setPosition({ x: 0, y: 0 }, 'vertical');

    expect(ship.isPositioned).toBe(true);
  });

  describe('setHit method', () => {
    it('setHit should change coordinate status to hit', () => {
      const ship = new Ship(2);
      ship.setPosition({ x: 0, y: 0 }, 'vertical');
      ship.setHit({ x: 0, y: 1 });
      expect(ship.coordinates[1].isHit).toBe(true);
    });
  });

  describe('findSurroundingCells method', () => {
    it('findSurroundingCells should return array of surrounding coordiantes', () => {
      const surroundingCells = Ship.findSurroundingCells({
        startCoordinate: { x: 3, y: 3 },
        direction: 'horizontal',
        size: 4,
        boardSize: 10,
      });

      expect(surroundingCells).toHaveLength(14);
    });

    it('findSurroundingCells should return array of inbound surrounding coordiantes', () => {
      const surroundingCells = Ship.findSurroundingCells({
        startCoordinate: { x: 0, y: 0 },
        direction: 'vertical',
        size: 1,
        boardSize: 10,
      });

      expect(surroundingCells).toHaveLength(3);
    });
  });
});
