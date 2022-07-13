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
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateHouseDto, UpdateHouseDto } from './houses-dto';
import { ValidationPipe } from '../common/pipe/validation.pipe';
import { Request } from 'express';
import UserEntity from '../entities/user.entity';
import { HOUSE_ENTITY_KEYS } from '../entities/house.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async getHouses(): Promise<Record<string, any>> {
    return await this.housesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  public async createHouse(
    @Req() request: Request,
    @Body() createHouseDto: CreateHouseDto,
  ) {
    createHouseDto[HOUSE_ENTITY_KEYS.OWNER] = request.user as UserEntity;

    return await this.housesService.create(createHouseDto);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async updateHouse(
    @Param('id') id: string,
    @Body() updateHouseDto: UpdateHouseDto,
  ) {
    return await this.housesService.update(id, updateHouseDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async deleteHouse(@Param('id') id: string) {
    return this.housesService.delete(id);
  }
}
