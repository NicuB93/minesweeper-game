import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { GameResultsController } from './game-results.controller';
import { GameResultsService } from './game-results.service';

@Module({
  imports: [PrismaModule],
  controllers: [GameResultsController],
  providers: [GameResultsService],
  exports: [GameResultsService],
})
export class GameResultsModule {}
