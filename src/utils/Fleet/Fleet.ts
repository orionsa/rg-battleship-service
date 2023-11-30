import { Ship } from './Ship';
import { TSize, IPositionShipDto } from './Fleet.interface';
import { genId } from '../nanoid';

export class Fleet {
  public id: string;
  public ships: Ship[];

  constructor() {
    this.id = genId({ prefix: 'fleet_' });
    this.ships = [];
    this.initFleet();
  }

  get _activeShips(): Ship[] {
    return this.ships.filter((ship) => {
      return !ship._isSunk && ship.isPositioned;
    });
  }

  public getShip(shipId: string): Ship {
    return this.ships.filter(({ id }) => id === shipId)[0];
  }

  public initFleet(): void {
    for (let i = 1; i <= 4; i++) {
      for (let j = 4 - i; j >= 0; j--) {
        const ship = new Ship(i as TSize);

        this.ships.push(ship);
        // this.manager.set(ship.id, { isPositioned: false });
      }
    }
  }

  public validateShipById(id: string): boolean {
    if (!id) {
      return false;
    }

    const ship = this.getShip(id);
    if (!ship) {
      return false;
    }

    return true;
  }
}
