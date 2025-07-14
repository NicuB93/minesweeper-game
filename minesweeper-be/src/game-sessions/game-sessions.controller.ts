import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GameSession } from '@prisma/client';
import { PlayerActionDto, StartGameDto } from './dto';
import { GameSessionsService } from './game-sessions.service';

@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly gameSessionsService: GameSessionsService) {}

  @Post()
  async startNewGame(@Body() startGameDto: StartGameDto): Promise<GameSession> {
    return await this.gameSessionsService.startNewGame(startGameDto);
  }

  @Get(':id')
  async getGameSession(@Param('id') id: string): Promise<GameSession> {
    return await this.gameSessionsService.getGameSession(id);
  }

  @Put(':id/reveal')
  async revealCell(
    @Param('id') id: string,
    @Body() action: PlayerActionDto,
  ): Promise<GameSession> {
    return await this.gameSessionsService.revealCell(id, action);
  }

  @Put(':id/flag')
  async toggleFlag(
    @Param('id') id: string,
    @Body() action: PlayerActionDto,
  ): Promise<GameSession> {
    return await this.gameSessionsService.toggleFlag(id, action);
  }

  @Put(':id/timer')
  async updateTimer(@Param('id') id: string): Promise<GameSession> {
    return await this.gameSessionsService.updateTimer(id);
  }

  @Delete(':id')
  async deleteGameSession(@Param('id') id: string): Promise<GameSession> {
    return await this.gameSessionsService.deleteGameSession(id);
  }

  @Get()
  async getActiveSessions(
    @Query('limit') limit?: string,
  ): Promise<GameSession[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.gameSessionsService.getActiveSessions(limitNum);
  }
}
