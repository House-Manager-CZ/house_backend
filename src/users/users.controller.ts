import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
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
import UserEntity from '../entities/user.entity';

@UseInterceptors(SentryInterceptor, ClassSerializerInterceptor)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async getUsers(): Promise<Record<string, any>> {
    const users = await this.usersService.findAll();

    if (!users.length) throw new NotFoundException('No users found');

    return users;
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async getAuthenticatedUser(
    @Req() request: Request,
  ): Promise<UserEntity> {
    const currentUser = <UserEntity>request.user;

    return await this.usersService.findById(currentUser.id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Record<string, any>> {
    return await this.usersService.create(createUserDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteAllUsers(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
