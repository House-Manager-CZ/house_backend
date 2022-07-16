import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { USER_ENTITY_KEYS } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    name: USER_ENTITY_KEYS.USERNAME,
    description: 'Username',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  [USER_ENTITY_KEYS.USERNAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.EMAIL,
    description: 'Email',
    type: 'string',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  [USER_ENTITY_KEYS.EMAIL]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.PASSWORD,
    description: 'Password',
    type: 'string',
    format: 'password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  [USER_ENTITY_KEYS.PASSWORD]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.FIRST_NAME,
    description: 'First name',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.FIRST_NAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.LAST_NAME,
    description: 'Last name',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.LAST_NAME]: string;
}

export class UpdateUserDto {
  @ApiProperty({
    name: USER_ENTITY_KEYS.USERNAME,
    description: 'Username',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.USERNAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.EMAIL,
    description: 'Email',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  [USER_ENTITY_KEYS.EMAIL]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.PASSWORD,
    description: 'Password',
    type: 'string',
    format: 'password',
    required: false,
  })
  @IsOptional()
  @MinLength(6)
  [USER_ENTITY_KEYS.PASSWORD]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.FIRST_NAME,
    description: 'First name',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.FIRST_NAME]: string;

  @ApiProperty({
    name: USER_ENTITY_KEYS.LAST_NAME,
    description: 'Last name',
    type: 'string',
    required: false,
  })
  @IsOptional()
  @IsString()
  [USER_ENTITY_KEYS.LAST_NAME]: string;
}
