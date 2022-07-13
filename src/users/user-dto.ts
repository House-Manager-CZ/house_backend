import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { USER_ENTITY_KEYS } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  [USER_ENTITY_KEYS.EMAIL]: string;

  @IsNotEmpty()
  @MinLength(6)
  [USER_ENTITY_KEYS.PASSWORD]: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  [USER_ENTITY_KEYS.EMAIL]: string;

  @IsNotEmpty()
  @MinLength(6)
  [USER_ENTITY_KEYS.PASSWORD]: string;
}
