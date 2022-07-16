import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousesController } from './houses.controller';
import HouseEntity from '../entities/house.entity';
import { MembersService } from './members.service';
import UserEntity from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HouseEntity, UserEntity])],
  providers: [HousesService, MembersService],
  controllers: [HousesController],
})
export class HousesModule {}
