import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { USER_ENTITY_KEYS } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  [USER_ENTITY_KEYS.USERNAME]: string;

  @IsNotEmpty()
  @IsEmail()
  [USER_ENTITY_KEYS.EMAIL]: string;

  @IsNotEmpty()
  @MinLength(6)
  [USER_ENTITY_KEYS.PASSWORD]: string;

  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.FIRST_NAME]: string;

  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.LAST_NAME]: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.USERNAME]: string;

  @IsOptional()
  @IsEmail()
  [USER_ENTITY_KEYS.EMAIL]: string;

  @IsOptional()
  @MinLength(6)
  [USER_ENTITY_KEYS.PASSWORD]: string;

  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.FIRST_NAME]: string;

  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.LAST_NAME]: string;
}
