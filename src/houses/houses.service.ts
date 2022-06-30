import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HouseEntity, { HOUSE_STATUSES } from '../entities/house.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateHouseDto, UpdateHouseDto } from './houses-dto';
import { DB_ERROR_CODES } from '../db/constants';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(HouseEntity)
    private readonly housesRepository: Repository<HouseEntity>,
  ) {}

  public async findAll(): Promise<Array<HouseEntity>> {
    return this.housesRepository.find({
      where: {
        status: Not(In([HOUSE_STATUSES.DELETED])),
      },
      relations: ['owner'],
    });
  }

  public async create(createDto: CreateHouseDto): Promise<HouseEntity> {
    const house = await this.housesRepository.create({
      ...createDto,
      ...(createDto.location && {
        location: () => `ST_GeomFromText('POINT(${createDto.location})')`,
      }),
    });

    await this.housesRepository.save(house).catch((err: any) => {
      if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT)
        throw new ConflictException('House already exists');
      throw new InternalServerErrorException("Can't create house");
    });

    return await this.housesRepository.findOne({
      where: { id: house.id },
      relations: ['owner'],
    });
  }

  public async update(
    id: string,
    updateDto: UpdateHouseDto,
  ): Promise<HouseEntity> {
    const house = await this.housesRepository.findOne({
      where: { id, status: Not(In([HOUSE_STATUSES.DELETED])) },
    });

    if (!house) throw new NotFoundException('House not found');

    await this.housesRepository
      .update(id, {
        ...updateDto,
        ...(updateDto.location && {
          location: () => `ST_GeomFromText('POINT(${updateDto.location})')`,
        }),
      })
      .catch((err: any) => {
        if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT)
          throw new ConflictException('House already exists');
        throw new InternalServerErrorException("Can't update house");
      });

    return await this.housesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
  }

  public async delete(id: string): Promise<void> {
    const house = await this.housesRepository.findOne({ where: { id } });

    if (!house) throw new NotFoundException('House not found');

    await this.housesRepository.save({
      ...house,
      status: HOUSE_STATUSES.DELETED,
    });
  }
}
