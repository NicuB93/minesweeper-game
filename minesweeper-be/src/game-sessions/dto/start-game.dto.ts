import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { Difficulty } from '../../common/types/game.types';

export class StartGameDto {
  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty: Difficulty;

  @IsOptional()
  @IsString()
  @MaxLength(3, { message: 'Player initials must be 3 characters or less' })
  playerInitials?: string;
}
