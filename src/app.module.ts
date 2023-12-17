import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MatchManagerModule } from './match-manager/match-manager.module';

@Module({
  imports: [MatchManagerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
