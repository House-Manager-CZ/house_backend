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
import {
  AddHouseMemberDto,
  CreateHouseDto,
  DeleteHouseMemberDto,
  UpdateHouseDto,
} from './houses-dto';
import { ValidationPipe } from '../common/pipe/validation.pipe';
import { Request } from 'express';
import UserEntity from '../entities/user.entity';
import HouseEntity, { HOUSE_ENTITY_KEYS } from '../entities/house.entity';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { MembersService } from './members.service';

@ApiTags('houses')
@ApiCookieAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller('houses')
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly membersService: MembersService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Houses array',
    type: HouseEntity,
    isArray: true,
  })
  public async getHouses(): Promise<Record<string, any>> {
    return await this.housesService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'House created',
  })
  @ApiConflictResponse({
    description: 'House already exists',
  })
  @ApiBody({
    type: CreateHouseDto,
  })
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
  @ApiOkResponse({
    description: 'House updated',
    type: () => HouseEntity,
  })
  @ApiNotFoundResponse({
    description: 'House not found',
  })
  @ApiConflictResponse({
    description: 'House already exists',
  })
  @ApiParam({
    name: 'id',
    description: 'House id',
    type: 'string',
    required: true,
  })
  @ApiBody({
    type: UpdateHouseDto,
  })
  public async updateHouse(
    @Param('id') id: string,
    @Body() updateHouseDto: UpdateHouseDto,
  ) {
    return await this.housesService.update(id, updateHouseDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse({
    description: 'House deleted',
  })
  @ApiNotFoundResponse({
    description: 'House not found',
  })
  @ApiParam({
    name: 'id',
    description: 'House id',
    type: 'string',
    required: true,
  })
  public async deleteHouse(@Param('id') id: string) {
    return this.housesService.delete(id);
  }

  @Get('/:id/members')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'House members',
    type: UserEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'House not found',
  })
  public getHouseMembers(@Param('id') id: string) {
    return this.membersService.findAll(id);
  }

  @Post('/:id/members')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({
    description: 'House member added',
    type: UserEntity,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'House not found',
  })
  @ApiUnprocessableEntityResponse({
    description: 'House member not found',
  })
  public addHouseMember(
    @Param('id') id: string,
    @Body() addHouseMemberDto: AddHouseMemberDto,
  ) {
    return this.membersService.addMember(id, addHouseMemberDto);
  }

  @Delete('/:id/members')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse({
    description: 'House member deleted',
  })
  @ApiNotFoundResponse({
    description: 'House not found',
  })
  @ApiUnprocessableEntityResponse({
    description: 'House member not found',
  })
  public deleteHouseMember(
    @Param('id') id: string,
    @Body() deleteHouseMemberDto: DeleteHouseMemberDto,
  ) {
    return this.membersService.deleteMember(id, deleteHouseMemberDto);
  }
}
