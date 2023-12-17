import { Module } from '@nestjs/common';

import { MatchManagerService } from './match-manager.service';
import { MatchManagerController } from './match-manager.controller';

@Module({
  providers: [MatchManagerService],
  controllers: [MatchManagerController],
})
export class MatchManagerModule {}
