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

export class CreateHouseDto {
  @IsNotEmpty()
  [HOUSE_ENTITY_KEYS.NAME]: string;

  @Validate(LatLngConstraint)
  @IsOptional()
  [HOUSE_ENTITY_KEYS.LOCATION]: Point;

  @IsEmpty()
  [HOUSE_ENTITY_KEYS.OWNER]: UserEntity;
}

export class UpdateHouseDto {
  @IsString()
  @IsOptional()
  [HOUSE_ENTITY_KEYS.NAME]: string;

  @Validate(LatLngConstraint)
  @IsOptional()
  [HOUSE_ENTITY_KEYS.LOCATION]: Point;
}
