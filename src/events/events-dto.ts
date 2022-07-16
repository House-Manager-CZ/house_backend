import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { EVENT_ENTITY_KEYS } from '../entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({
    name: EVENT_ENTITY_KEYS.NAME,
    description: 'Event name',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  [EVENT_ENTITY_KEYS.NAME]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOUSE,
    description: 'Event house',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  [EVENT_ENTITY_KEYS.HOUSE]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOLDING_AT,
    description: 'Event holding at',
    type: 'string',
    format: 'date-time',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  [EVENT_ENTITY_KEYS.HOLDING_AT]: Date;
}

export class UpdateEventDto {
  @ApiProperty({
    name: EVENT_ENTITY_KEYS.NAME,
    description: 'Event name',
    type: 'string',
    required: false,
  })
  @IsOptional()
  [EVENT_ENTITY_KEYS.NAME]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOUSE,
    description: 'Event house',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  [EVENT_ENTITY_KEYS.HOUSE]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOLDING_AT,
    description: 'Event holding at',
    type: 'string',
    format: 'date-time',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  [EVENT_ENTITY_KEYS.HOLDING_AT]: Date;
}
