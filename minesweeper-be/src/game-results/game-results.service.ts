import { Injectable } from '@nestjs/common';
import { GameResult } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGameResultDto, GameResultQueryDto } from './dto';

@Injectable()
export class GameResultsService {
  constructor(private prisma: PrismaService) {}

  async createGameResult(data: CreateGameResultDto): Promise<GameResult> {
    return await this.prisma.gameResult.create({
      data: {
        playerInitials: data.playerInitials.toUpperCase(),
        completionTime: data.completionTime,
        gameDate: data.gameDate ? new Date(data.gameDate) : new Date(),
      },
    });
  }

  async getGameResults(query: GameResultQueryDto = {}): Promise<GameResult[]> {
    const { limit = 10, orderBy = 'completionTime', order = 'asc' } = query;

    return await this.prisma.gameResult.findMany({
      take: limit,
      orderBy: {
        [orderBy]: order,
      },
    });
  }

  async getLeaderboard(limit: number = 10): Promise<GameResult[]> {
    return await this.prisma.gameResult.findMany({
      take: limit,
      orderBy: {
        completionTime: 'asc',
      },
    });
  }

  async getPlayerStats(playerInitials: string): Promise<{
    totalGames: number;
    bestTime: number | null;
    averageTime: number | null;
    recentGames: GameResult[];
  }> {
    const initials = playerInitials.toUpperCase();

    const games = await this.prisma.gameResult.findMany({
      where: {
        playerInitials: initials,
      },
      orderBy: {
        gameDate: 'desc',
      },
    });

    const totalGames = games.length;
    const bestTime =
      totalGames > 0 ? Math.min(...games.map((g) => g.completionTime)) : null;
    const averageTime =
      totalGames > 0
        ? Math.round(
            games.reduce((sum, g) => sum + g.completionTime, 0) / totalGames,
          )
        : null;

    return {
      totalGames,
      bestTime,
      averageTime,
      recentGames: games.slice(0, 5), // Last 5 games
    };
  }

  async deleteGameResult(id: string): Promise<GameResult> {
    return this.prisma.gameResult.delete({
      where: { id },
    });
  }
}
