import { Fleet } from './Fleet';

describe('Fleet.ts', () => {
  describe('Ships constructor', () => {
    it('should create new instance of Ships with 10 ships', () => {
      const fleet = new Fleet();

      expect(fleet.ships).toHaveLength(10);
    });
  });

  describe('positionShip mehod', () => {
    it('should set the coordinates of the first ship and change its flag', () => {
      const fleet = new Fleet();

      expect(fleet._activeShips).toHaveLength(0);

      const { id } = fleet.ships[0];
      fleet.positionShip({
        id,
        direction: 'vertical',
        startCoordinate: { x: 0, y: 0 },
      });

      expect(fleet._activeShips).toHaveLength(1);
      expect(fleet.ships[0].isPositioned).toBe(true);
    });
  });
});
