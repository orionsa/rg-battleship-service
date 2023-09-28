import { Ship } from './Ship';
import { TSize } from './Fleet.interface';

export class Fleet {
  public ships: Ship[];

  constructor() {
    this.ships = [];
    this.initFleet();
  }

  public initFleet = () => {
    for (let i = 1; i <= 4; i++) {
      for (let j = 4 - i; j >= 0; j--) {
        this.ships.push(
          new Ship({
            size: i as TSize,
            direction: 'vertical',
            startCoordinate: { x: 0, y: 0 },
          }),
        );
      }
    }
  };
}
