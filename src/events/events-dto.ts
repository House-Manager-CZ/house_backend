import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { EVENT_ENTITY_KEYS } from '../entities/event.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum EVENT_FILTERS {
  DIRECTION = 'direction',
}

export enum EVENT_DIRECTIONS {
  UPCOMING = 'upcoming',
  FINISHED = 'finished',
}

export class GetEventsFilterDTO {
  @ApiProperty({
    name: EVENT_ENTITY_KEYS.HOUSE,
    description: "Event house's id",
    type: 'string',
    required: false,
    example: '5e8f8f8f-8f8f-8f8f-8f8f-8f8f8f8f8f8f',
  })
  @IsOptional()
  @IsUUID()
  [EVENT_ENTITY_KEYS.HOUSE]: string;

  @ApiProperty({
    name: EVENT_ENTITY_KEYS.OWNER,
    description: "Event owner's id",
    type: 'number',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumberString()
  [EVENT_ENTITY_KEYS.OWNER]: number;

  @ApiProperty({
    name: EVENT_FILTERS.DIRECTION,
    description: `Event direction (${EVENT_DIRECTIONS.UPCOMING} / ${EVENT_DIRECTIONS.FINISHED})`,
    type: 'string',
    required: false,
    example: EVENT_DIRECTIONS.UPCOMING,
  })
  @IsOptional()
  @IsIn(Object.values(EVENT_DIRECTIONS))
  [EVENT_FILTERS.DIRECTION]: EVENT_DIRECTIONS;
}

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
