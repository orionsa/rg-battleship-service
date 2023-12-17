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
    it('should set ship position ', () => {
      const ship = new Ship(2);

      expect(ship.isPositioned).toBe(false);

      ship.setPosition({ x: 0, y: 0 }, 'vertical');

      expect(ship.isPositioned).toBe(true);
    });
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

  describe('getPredictedShipCoordinates method', () => {
    it('getPredictedShipCoordinates should return array of predicted ship coordinates', () => {
      const SIZE = 4;
      const predictedShipCoordinates = Ship.getPredictedShipCoordinates({
        startCoordinate: { x: 2, y: 2 },
        direction: 'horizontal',
        size: SIZE,
        boardSize: 10,
      });

      expect(predictedShipCoordinates).toHaveLength(SIZE);
    });
  });

  describe('unsetPosition method', () => {
    it('should set isPositioned flag to false, reset coordinates array to empty and change direction to null', () => {
      const ship = new Ship(4);
      ship.setPosition({ x: 0, y: 0 }, 'horizontal');

      expect(ship.isPositioned).toBe(true);
      ship.unsetPosition();
      expect(ship.isPositioned).toBe(false);
      expect(ship.direction).toBe(null);
      expect(ship.coordinates).toHaveLength(0);
    });
  });

  describe('getOwnSurroundingCells method', () => {
    const ship = new Ship(1);
    ship.setPosition({ x: 0, y: 0 }, 'horizontal');
    const cells = ship.getOwnSurroundingCells();
    expect(cells).toHaveLength(3);
  });
});
