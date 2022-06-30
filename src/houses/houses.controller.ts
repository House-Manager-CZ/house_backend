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
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { HousesService } from './houses.service';
import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateHouseDto, UpdateHouseDto } from './houses-dto';
import { ValidationPipe } from '../common/pipe/validation.pipe';
import { Request } from 'express';
import UserEntity from '../entities/user.entity';
import { HOUSE_ENTITY_KEYS } from '../entities/house.entity';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async getHouses(): Promise<Record<string, any>> {
    const houses = await this.housesService.findAll();

    if (!houses.length) throw new NotFoundException('No houses found');

    return instanceToPlain(houses);
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

    const house = await this.housesService.create(createHouseDto);

    return instanceToPlain(house);
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async updateHouse(
    @Param('id') id: string,
    @Body() updateHouseDto: UpdateHouseDto,
  ) {
    const house = await this.housesService.update(id, updateHouseDto);

    return instanceToPlain(house);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async deleteHouse(@Param('id') id: string) {
    return this.housesService.delete(id);
  }
}
