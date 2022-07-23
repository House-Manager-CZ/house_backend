import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumberString,
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

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.MEMBERS,
    description: "House's members",
    type: 'number',
    isArray: true,
    required: false,
  })
  @IsInt({ each: true })
  @IsOptional()
  [HOUSE_ENTITY_KEYS.MEMBERS]: Array<number>;
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

  @ApiProperty({
    name: HOUSE_ENTITY_KEYS.MEMBERS,
    description: "House's members",
    type: 'number',
    isArray: true,
    required: false,
  })
  @IsInt({ each: true })
  @IsOptional()
  [HOUSE_ENTITY_KEYS.MEMBERS]: Array<number>;
}

export class AddHouseMemberDto {
  @IsNotEmpty()
  @IsNumberString()
  @ApiProperty({
    name: 'user_id',
    description: 'User id',
    type: 'string',
    required: true,
  })
  user_id: number;
}

export class DeleteHouseMemberDto extends AddHouseMemberDto {}
