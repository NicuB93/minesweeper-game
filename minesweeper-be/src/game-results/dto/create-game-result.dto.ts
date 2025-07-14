/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGameResultDto {
  @IsString()
  @MaxLength(3, { message: 'Player initials must be 3 characters or less' })
  playerInitials: string;

  @IsInt()
  @Min(1, { message: 'Completion time must be at least 1 second' })
  completionTime: number;

  @IsOptional()
  @IsDateString()
  gameDate?: string;
}
