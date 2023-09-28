import { Fleet } from './Fleet';

describe('Fleet.ts', () => {
  describe('Ships constructor', () => {
    it('should create new instance of Ships with 10 ships', () => {
      const fleet = new Fleet();

      expect(fleet.ships).toHaveLength(10);
    });
  });
});
