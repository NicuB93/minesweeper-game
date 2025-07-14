import { IsString, MaxLength } from 'class-validator';

export class PlayerInitialsDto {
  @IsString()
  @MaxLength(3, { message: 'Player initials must be 3 characters or less' })
  initials: string;
}
