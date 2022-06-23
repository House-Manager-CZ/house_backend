import { Module } from '@nestjs/common';
import { HousesService } from './houses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousesController } from './houses.controller';
import HouseEntity from '../entities/house.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HouseEntity])],
  providers: [HousesService],
  controllers: [HousesController],
})
export class HousesModule {}
