import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user-dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import SentryInterceptor from '../common/interceptors/sentry.interceptor';
import { Request } from 'express';
import UserEntity, { USER_ENTITY_KEYS } from '../entities/user.entity';
import { Like } from 'typeorm';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiCookieAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseInterceptors(SentryInterceptor, ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Users array',
    type: UserEntity,
    isArray: true,
  })
  @ApiQuery({
    type: 'string',
    name: 'q',
    description: 'Search query',
    required: false,
  })
  public async getUsers(
    @Query('q') query?: string,
  ): Promise<Array<UserEntity>> {
    return await this.usersService.findAll({
      ...(query && { [USER_ENTITY_KEYS.SEARCH_NAME]: Like(`%${query}%`) }),
    });
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'User',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  public async getAuthenticatedUser(
    @Req() request: Request,
  ): Promise<UserEntity> {
    const currentUser = <UserEntity>request.user;

    return await this.usersService.findById(currentUser[USER_ENTITY_KEYS.ID]);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User',
    type: UserEntity,
  })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBody({
    description: 'Create user DTO',
    type: CreateUserDto,
  })
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.create(createUserDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User updated',
    type: UserEntity,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Update user DTO',
    type: UpdateUserDto,
  })
  public async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'User deleted',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    type: 'string',
    required: true,
  })
  public async deleteAllUsers(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
