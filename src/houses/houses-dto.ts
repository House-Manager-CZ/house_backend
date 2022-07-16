import {
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { Point } from 'geojson';
import { LatLngConstraint } from '../common/validation/constraints/LatLng.constraint';
import UserEntity from '../entities/user.entity';
import { HOUSE_ENTITY_KEYS } from '../entities/house.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHouseDto {
  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.NAME,
    description: 'House name',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  [HOUSE_ENTITY_KEYS.NAME]: string;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.LOCATION,
    description: 'House location',
    type: 'string',
    example: '33.33 -44.44',
    required: false,
  })
  @Validate(LatLngConstraint)
  @IsOptional()
  [HOUSE_ENTITY_KEYS.LOCATION]: Point;

  @IsEmpty()
  [HOUSE_ENTITY_KEYS.OWNER]: UserEntity;
}

export class UpdateHouseDto {
  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.NAME,
    description: 'House name',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  [HOUSE_ENTITY_KEYS.NAME]: string;

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.LOCATION,
    description: 'House location',
    type: 'string',
    example: '33.33 -44.44',
    required: false,
  })
  @Validate(LatLngConstraint)
  @IsOptional()
  [HOUSE_ENTITY_KEYS.LOCATION]: Point;
}
