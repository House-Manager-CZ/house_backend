import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './user-dto';
import { instanceToPlain } from 'class-transformer';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getUsers(): Promise<Record<string, any>> {
    const users = await this.usersService.findAll();

    if (!users.length) throw new NotFoundException('No users found');

    return instanceToPlain(users);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Record<string, any>> {
    const user = await this.usersService.create(createUserDto);

    return instanceToPlain(user);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);

    return instanceToPlain(user);
  }

  @Delete('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async deleteAllUsers(@Param('id') id: string): Promise<void> {
    return this.usersService.delete(id);
  }
}
