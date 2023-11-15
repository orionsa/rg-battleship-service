import { Ship } from './Ship';
import { TSize, TFleetItem, IPositionShipDto } from './Fleet.interface';
import { genId } from '../nanoid';

export class Fleet {
  public id: string;
  public ships: Ship[];
  // public manager: Map<string, TFleetItem>;

  constructor() {
    this.id = genId({ prefix: 'fleet_' });
    this.ships = [];
    // this.manager = new Map();
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

  public positionShip({
    id,
    direction,
    startCoordinate,
  }: IPositionShipDto): void {
    const ship: Ship = this.getShip(id);
    ship.setPosition(startCoordinate, direction);
  }
}
