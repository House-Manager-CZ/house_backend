import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HouseEntity, {
  HOUSE_ENTITY_KEYS,
  HOUSE_STATUSES,
} from '../entities/house.entity';
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
        [HOUSE_ENTITY_KEYS.STATUS]: Not(In([HOUSE_STATUSES.DELETED])),
      },
      relations: [HOUSE_ENTITY_KEYS.OWNER, HOUSE_ENTITY_KEYS.MEMBERS],
    });
  }

  public async create(createDto: CreateHouseDto): Promise<HouseEntity> {
    const house = await this.housesRepository.create({
      ...createDto,
      ...(createDto[HOUSE_ENTITY_KEYS.LOCATION] && {
        [HOUSE_ENTITY_KEYS.LOCATION]: () =>
          `ST_GeomFromText('POINT(${createDto[HOUSE_ENTITY_KEYS.LOCATION]})')`,
      }),
    });

    await this.housesRepository.save(house).catch((err: any) => {
      if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT)
        throw new ConflictException('House already exists');
      throw new InternalServerErrorException("Can't create house");
    });

    return await this.housesRepository.findOne({
      where: { [HOUSE_ENTITY_KEYS.ID]: house[HOUSE_ENTITY_KEYS.ID] },
      relations: [HOUSE_ENTITY_KEYS.OWNER, HOUSE_ENTITY_KEYS.MEMBERS],
    });
  }

  public async update(
    id: string,
    updateDto: UpdateHouseDto,
  ): Promise<HouseEntity> {
    const house = await this.housesRepository.findOne({
      where: {
        [HOUSE_ENTITY_KEYS.ID]: id,
        [HOUSE_ENTITY_KEYS.STATUS]: Not(In([HOUSE_STATUSES.DELETED])),
      },
    });

    if (!house) throw new NotFoundException('House not found');

    await this.housesRepository
      .update(id, {
        ...updateDto,
        ...(updateDto[HOUSE_ENTITY_KEYS.LOCATION] && {
          [HOUSE_ENTITY_KEYS.LOCATION]: () =>
            `ST_GeomFromText('POINT(${
              updateDto[HOUSE_ENTITY_KEYS.LOCATION]
            })')`,
        }),
      })
      .catch((err: any) => {
        if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT)
          throw new ConflictException('House already exists');
        throw new InternalServerErrorException("Can't update house");
      });

    return await this.housesRepository.findOne({
      where: { [HOUSE_ENTITY_KEYS.ID]: id },
      relations: [HOUSE_ENTITY_KEYS.OWNER, HOUSE_ENTITY_KEYS.MEMBERS],
    });
  }

  public async delete(id: string): Promise<void> {
    const house = await this.housesRepository.findOne({
      where: { [HOUSE_ENTITY_KEYS.ID]: id },
    });

    if (!house) throw new NotFoundException('House not found');

    await this.housesRepository.save({
      ...house,
      [HOUSE_ENTITY_KEYS.STATUS]: HOUSE_STATUSES.DELETED,
    });
  }
}
