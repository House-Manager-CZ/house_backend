import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  house: string;

  @IsDateString()
  @IsNotEmpty()
  holding_at: Date;
}

export class UpdateEventDto {
  @IsOptional()
  name: string;

  @IsOptional()
  @IsUUID()
  house: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  holding_at: Date;
}
