import { Board } from './Board';

describe('Board.ts', () => {
  describe('Board constructor', () => {
    it('should create new 10 X 10 matrics (Board)', () => {
      const board = new Board();

      expect(board.rows).toHaveLength(10);
      expect(board.rows.flat()).toHaveLength(100);
    });
  });
});
