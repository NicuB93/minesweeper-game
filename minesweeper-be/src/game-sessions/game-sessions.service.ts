import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GameSession } from '@prisma/client';
import { Cell, GAME_CONFIGS, GameState } from '../common/types/game.types';
import { PrismaService } from '../prisma/prisma.service';
import { PlayerActionDto, StartGameDto } from './dto';
import { GameUtils } from './game.utils';

@Injectable()
export class GameSessionsService {
  constructor(private prisma: PrismaService) {}

  async startNewGame(data: StartGameDto): Promise<GameSession> {
    const config = GAME_CONFIGS[data.difficulty];
    const emptyBoard = GameUtils.createEmptyBoard(config.rows, config.cols);

    const gameSession = await this.prisma.gameSession.create({
      data: {
        playerInitials: data.playerInitials?.toUpperCase(),
        board: emptyBoard,
        gameState: 'ready',
        timer: 0,
        flaggedCells: 0,
        firstClick: true,
        difficulty: data.difficulty,
        rows: config.rows,
        cols: config.cols,
        mines: config.mines,
      },
    });

    return gameSession;
  }

  async getGameSession(id: string): Promise<GameSession> {
    const session = await this.prisma.gameSession.findUnique({
      where: { id },
    });

    if (!session) {
      throw new NotFoundException('Game session not found');
    }

    return session;
  }

  async revealCell(
    sessionId: string,
    action: PlayerActionDto,
  ): Promise<GameSession> {
    const session = await this.getGameSession(sessionId);

    if (session.gameState === 'won' || session.gameState === 'lost') {
      throw new BadRequestException('Game is already finished');
    }

    const board = session.board as Cell[][];
    const { row, col } = action;

    // Validate coordinates
    if (row < 0 || row >= session.rows || col < 0 || col >= session.cols) {
      throw new BadRequestException('Invalid cell coordinates');
    }

    if (board[row][col].isRevealed || board[row][col].isFlagged) {
      throw new BadRequestException('Cell is already revealed or flagged');
    }

    let newBoard = board;
    let newGameState: GameState = session.gameState as GameState;
    let newTimer = session.timer;

    // Handle first click - place mines and start timer
    if (session.firstClick) {
      newBoard = GameUtils.placeMines(board, session.mines, row, col);
      newGameState = 'playing';
      newTimer = 1; // Start with 1 second
    }

    // Reveal the cell
    newBoard = GameUtils.revealCell(newBoard, row, col);

    // Check if player hit a mine
    if (newBoard[row][col].isMine) {
      newGameState = 'lost';
      newBoard = GameUtils.revealAllMines(newBoard);
    } else if (GameUtils.checkWinCondition(newBoard)) {
      newGameState = 'won';
    }

    const updatedSession = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        board: newBoard,
        gameState: newGameState,
        timer: newTimer,
        firstClick: false,
      },
    });

    return updatedSession;
  }

  async toggleFlag(
    sessionId: string,
    action: PlayerActionDto,
  ): Promise<GameSession> {
    const session = await this.getGameSession(sessionId);

    if (session.gameState === 'won' || session.gameState === 'lost') {
      throw new BadRequestException('Game is already finished');
    }

    const board = session.board as Cell[][];
    const { row, col } = action;

    // Validate coordinates
    if (row < 0 || row >= session.rows || col < 0 || col >= session.cols) {
      throw new BadRequestException('Invalid cell coordinates');
    }

    if (board[row][col].isRevealed) {
      throw new BadRequestException('Cannot flag a revealed cell');
    }

    const newBoard = GameUtils.toggleFlag(board, row, col);
    const newFlaggedCells = GameUtils.countFlags(newBoard);

    const updatedSession = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        board: newBoard,
        flaggedCells: newFlaggedCells,
      },
    });

    return updatedSession;
  }

  async updateTimer(sessionId: string): Promise<GameSession> {
    const session = await this.getGameSession(sessionId);

    if (session.gameState !== 'playing') {
      return session; // Don't update timer if not playing
    }

    const updatedSession = await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        timer: session.timer + 1,
      },
    });

    return updatedSession;
  }

  async deleteGameSession(id: string): Promise<GameSession> {
    return await this.prisma.gameSession.delete({
      where: { id },
    });
  }

  async getActiveSessions(limit: number = 10): Promise<GameSession[]> {
    return await this.prisma.gameSession.findMany({
      where: {
        gameState: {
          in: ['ready', 'playing'],
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
    });
  }
}
