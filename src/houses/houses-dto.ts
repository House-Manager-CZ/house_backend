import { IsEmpty, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { Point } from 'geojson';
import { LatLngConstraint } from '../common/validation/constraints/LatLng.constraint';
import UserEntity from '../entities/user.entity';

export class CreateHouseDto {
  @IsNotEmpty()
  name: string;

  @Validate(LatLngConstraint)
  @IsOptional()
  location: Point;

  @IsEmpty()
  owner: UserEntity;
}

export class UpdateHouseDto {
  @IsNotEmpty()
  name: string;

  @Validate(LatLngConstraint)
  @IsOptional()
  location: Point;
}
