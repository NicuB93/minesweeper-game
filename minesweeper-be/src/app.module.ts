import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameResultsModule } from './game-results/game-results.module';
import { GameSessionsModule } from './game-sessions/game-sessions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, GameResultsModule, GameSessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
