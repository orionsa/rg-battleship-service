import { Ship } from './Ship';

describe('Ship.ts', () => {
  it('should create new Ship instance', () => {
    const ship = new Ship({
      size: 2,
      direction: 'vertical',
      startCoordinate: { x: 0, y: 0 },
    });

    expect(ship).toBeInstanceOf(Ship);
  });
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
