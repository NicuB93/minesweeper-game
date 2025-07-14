import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GameResult } from '@prisma/client';
import {
  CreateGameResultDto,
  GameResultQueryDto,
  PlayerInitialsDto,
} from './dto';
import { GameResultsService } from './game-results.service';

@Controller('game-results')
export class GameResultsController {
  constructor(private readonly gameResultsService: GameResultsService) {}

  @Post()
  async createGameResult(
    @Body() createGameResultDto: CreateGameResultDto,
  ): Promise<GameResult> {
    return await this.gameResultsService.createGameResult(createGameResultDto);
  }

  @Get()
  async getGameResults(
    @Query() query: GameResultQueryDto,
  ): Promise<GameResult[]> {
    return await this.gameResultsService.getGameResults(query);
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: string): Promise<GameResult[]> {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.gameResultsService.getLeaderboard(limitNum);
  }

  @Get('player/:initials')
  async getPlayerStats(@Param() params: PlayerInitialsDto) {
    return await this.gameResultsService.getPlayerStats(params.initials);
  }

  @Delete(':id')
  async deleteGameResult(@Param('id') id: string): Promise<GameResult> {
    return await this.gameResultsService.deleteGameResult(id);
  }
}
