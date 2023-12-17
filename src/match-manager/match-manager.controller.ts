import { Controller } from '@nestjs/common';
import {
  EventPattern,
  Payload,
  Client,
  ClientKafka,
} from '@nestjs/microservices';

import { MatchManagerService } from './match-manager.service';
import { IJoinMatchRes } from './match-manager.interface';
import { IPositionShipDto } from 'src/utils/Fleet/Fleet.interface';
import { IMatchPayload } from './match-manager.interface';
import { kafkaConfig } from '../utils/kafkaConfig';
import { ICoordinate } from '../utils/shared.interface';

@Controller()
export class MatchManagerController {
  @Client(kafkaConfig)
  client: ClientKafka;
  constructor(private readonly service: MatchManagerService) {}

  @EventPattern('bs_game.action')
  handleGameAction(@Payload() data: IMatchPayload): void {
    const { action, payload, playerId, matchId } = data;
    switch (action) {
      case 'positionShip':
        this.service.positionShip(
          matchId,
          playerId,
          payload as IPositionShipDto,
        );
        break;
      case 'setHit':
        this.service.setHit(matchId, playerId, payload as ICoordinate);
        break;
      case 'devClearMatches':
        this.service.manager = new Map();
        break;
      case 'devLogMatches':
        console.log(this.service.manager);
        break;
      case 'devLogBoards':
        this.service.logBoards();
        break;
    }
  }

  @EventPattern('bs_game.join')
  handleJoinMatch(@Payload() socketId: string): IJoinMatchRes {
    const { matchId, playerId } = this.service.handleJoinMatch();
    console.log({ matchId, playerId, socketId });
    return { matchId, playerId, socketId };
  }
}
