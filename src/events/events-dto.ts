import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EVENT_ENTITY_KEYS } from '../entities/event.entity';

export class CreateEventDto {
  @IsNotEmpty()
  [EVENT_ENTITY_KEYS.NAME]: string;

  @IsNotEmpty()
  @IsUUID()
  [EVENT_ENTITY_KEYS.HOUSE]: string;

  @IsDateString()
  @IsNotEmpty()
  [EVENT_ENTITY_KEYS.HOLDING_AT]: Date;
}

export class UpdateEventDto {
  @IsOptional()
  [EVENT_ENTITY_KEYS.NAME]: string;

  @IsOptional()
  @IsUUID()
  [EVENT_ENTITY_KEYS.HOUSE]: string;

  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  [EVENT_ENTITY_KEYS.HOLDING_AT]: Date;
}
