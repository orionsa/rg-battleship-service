import { ICoordinate } from '../shared.interface';
import { Board } from './Board';

describe('Board.ts', () => {
  describe('Board constructor', () => {
    it('should create new 10 X 10 matrics (Board)', () => {
      const board = new Board();

      expect(board.rows).toHaveLength(10);
      expect(board.rows.flat()).toHaveLength(100);
    });
  });

  // describe('getBlockedCellsByParams method', () => {
  //   it('getBlockedCellsByParams should return array of surrounding coordiantes', () => {
  //     const board = new Board();

  //     const surroundingCells = board.getBlockedCellsByParams({
  //       startCoordinate: { x: 3, y: 3 },
  //       direction: 'vertical',
  //       shipSize: 4,
  //     });

  //     expect(surroundingCells.length).toBe(18);
  //   });

  //   it('getBlockedCellsByParams should return array of inbound surrounding coordiantes', () => {
  //     const board = new Board();

  //     const surroundingCells = board.getBlockedCellsByParams({
  //       startCoordinate: { x: 0, y: 0 },
  //       direction: 'vertical',
  //       shipSize: 1,
  //     });

  //     expect(surroundingCells.length).toBe(4);
  //   });
  // });

  // describe('getBlockedCells method', () => {
  //   it('getBlockedCells should return correct blocked cells set', () => {
  //     const board = new Board();
  //     const firstShipId = board.fleet.ships[0].id;
  //     const secondShipId = board.fleet.ships[1].id;
  //     const firstShipCoor = [
  //       { x: 0, y: 0 },
  //       { x: 1, y: 0 },
  //       { x: 0, y: 1 },
  //       { x: 1, y: 1 },
  //     ];

  //     const secondShipCoor = [
  //       { x: 8, y: 8 },
  //       { x: 9, y: 8 },
  //       { x: 8, y: 9 },
  //       { x: 9, y: 9 },
  //     ];

  //     board.shipBlockedCoordinates.set(firstShipId, firstShipCoor);
  //     board.shipBlockedCoordinates.set(secondShipId, secondShipCoor);
  //     const blockeCells = board.getBlockedCells(firstShipId);

  //     expect(
  //       blockeCells.length === secondShipCoor.length &&
  //         [...blockeCells].every((element) => secondShipCoor.includes(element)),
  //     ).toBe(true);
  //   });
  // });

  // describe('checkCellsOverlapping method', () => {
  //   it('should return true for overlapping cells ', () => {
  //     const board = new Board();

  //     const firstSet = [
  //       { x: 0, y: 0 },
  //       { x: 1, y: 0 },
  //       { x: 0, y: 1 },
  //       { x: 1, y: 1 },
  //     ];

  //     const secondSet = [
  //       { x: 1, y: 1 },
  //       { x: 2, y: 1 },
  //       { x: 1, y: 2 },
  //       { x: 2, y: 2 },
  //     ];

  //     const hasOverlapping = board.checkCellsOverlapping(firstSet, secondSet);
  //     expect(hasOverlapping).toBe(true);
  //   });
  // });

  describe('positionShipOnBoard method', () => {
    it('should position ship on board and set its border with correct id', () => {
      const board = new Board();
      const ship = board.fleet.ships[4];
      const startCoordinate = { x: 1, y: 1 };
      const direction = 'vertical';

      expect(ship.isPositioned).toBe(false);
      board.positionShipOnBoard({ id: ship.id, startCoordinate, direction });
      expect(ship.isPositioned).toBe(true);
      expect(board.rows[1][1].hasShip).toBe(true);
      expect(board.rows[1][2].hasShip).toBe(true);
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
        expect(() => {
          board.positionShipOnBoard({
            id: secondShipId,
            startCoordinate: secondShipStartCoordinate,
            direction,
          });
        }).toThrowError();
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

      board.rows[1][1].hasShip = true;

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
      board.logBoardCellsWithColors();
    });
  });
});
