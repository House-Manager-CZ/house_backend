import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EventEntity, {
  EVENT_ENTITY_KEYS,
  EVENT_FOREIGN_KEYS,
  EVENT_STATUSES,
} from '../entities/event.entity';
import {
  In,
  LessThanOrEqual,
  MoreThan,
  Not,
  QueryFailedError,
  Repository,
} from 'typeorm';
import {
  CreateEventDto,
  EVENT_DIRECTIONS,
  EVENT_FILTERS,
  GetEventsFilterDTO,
  UpdateEventDto,
} from './events-dto';
import { Request } from 'express';
import UserEntity, { USER_ENTITY_KEYS } from '../entities/user.entity';
import { DB_ERROR_CODES } from '../db/constants';
import { HOUSE_ENTITY_KEYS } from '../entities/house.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  public async findAll(
    query?: GetEventsFilterDTO,
  ): Promise<Array<EventEntity>> {
    return await this.eventRepository.find({
      where: {
        [EVENT_ENTITY_KEYS.STATUS]: Not(In([EVENT_STATUSES.DELETED])),
        ...(query[EVENT_ENTITY_KEYS.HOUSE] && {
          [EVENT_ENTITY_KEYS.HOUSE]: {
            [HOUSE_ENTITY_KEYS.ID]: query[EVENT_ENTITY_KEYS.HOUSE],
          },
        }),
        ...(query[EVENT_ENTITY_KEYS.OWNER] && {
          [EVENT_ENTITY_KEYS.OWNER]: {
            [USER_ENTITY_KEYS.ID]: query[EVENT_ENTITY_KEYS.OWNER],
          },
        }),
        ...(query[EVENT_FILTERS.DIRECTION] && {
          [EVENT_ENTITY_KEYS.HOLDING_AT]: (query[EVENT_FILTERS.DIRECTION] ===
            EVENT_DIRECTIONS.UPCOMING
            ? MoreThan
            : LessThanOrEqual)(new Date()),
        }),
      },
      relations: [EVENT_ENTITY_KEYS.HOUSE, EVENT_ENTITY_KEYS.OWNER],
    });
  }

  public async findOne(id: string): Promise<EventEntity> {
    return await this.eventRepository
      .findOne({
        where: {
          [EVENT_ENTITY_KEYS.ID]: id,
          [EVENT_ENTITY_KEYS.STATUS]: Not(In([EVENT_STATUSES.DELETED])),
        },
        relations: [EVENT_ENTITY_KEYS.HOUSE, EVENT_ENTITY_KEYS.OWNER],
      })
      .catch((err: QueryFailedError) => {
        if (err.driverError.code === DB_ERROR_CODES.INVALID_TEXT_REPRESENTATION)
          throw new BadRequestException('Invalid event ID');

        throw new InternalServerErrorException('Internal server error');
      });
  }

  public async create(
    request: Request,
    createDto: CreateEventDto,
  ): Promise<EventEntity> {
    const event = this.eventRepository.create({
      ...createDto,
      [EVENT_ENTITY_KEYS.HOUSE]: {
        [HOUSE_ENTITY_KEYS.ID]: createDto[EVENT_ENTITY_KEYS.HOUSE],
      },
      [EVENT_ENTITY_KEYS.OWNER]: {
        [USER_ENTITY_KEYS.ID]: (<UserEntity>request.user)[USER_ENTITY_KEYS.ID],
      },
    });

    const savedEvent = await this.eventRepository
      .save(event)
      .catch((err: QueryFailedError) => {
        if (err.driverError.code === DB_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
          switch (err.driverError.constraint) {
            case EVENT_FOREIGN_KEYS.HOUSE:
              throw new UnprocessableEntityException("House doesn't exist");
            case EVENT_FOREIGN_KEYS.OWNER:
              throw new UnprocessableEntityException("Owner doesn't exist");
          }
        }

        throw new InternalServerErrorException('Cannot create event');
      });

    return await this.eventRepository.findOne({
      where: { [EVENT_ENTITY_KEYS.ID]: savedEvent[EVENT_ENTITY_KEYS.ID] },
      relations: [EVENT_ENTITY_KEYS.HOUSE, EVENT_ENTITY_KEYS.OWNER],
    });
  }

  public async update(
    id: string,
    updateDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({
      where: {
        [EVENT_ENTITY_KEYS.ID]: id,
        [EVENT_ENTITY_KEYS.STATUS]: Not(In([EVENT_STATUSES.DELETED])),
      },
    });

    if (!event) throw new NotFoundException('Event not found');

    await this.eventRepository
      .update(id, {
        ...updateDto,
        ...(updateDto[EVENT_ENTITY_KEYS.HOUSE] && {
          [EVENT_ENTITY_KEYS.HOUSE]: {
            [HOUSE_ENTITY_KEYS.ID]: updateDto[EVENT_ENTITY_KEYS.HOUSE],
          },
        }),
      })
      .catch((err: QueryFailedError) => {
        if (err.driverError.code === DB_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
          switch (err.driverError.constraint) {
            case EVENT_FOREIGN_KEYS.HOUSE:
              throw new UnprocessableEntityException("House doesn't exist");
          }
        }

        throw new InternalServerErrorException('Cannot update event');
      });

    return await this.eventRepository.findOne({
      where: { [EVENT_ENTITY_KEYS.ID]: id },
      relations: [EVENT_ENTITY_KEYS.HOUSE, EVENT_ENTITY_KEYS.OWNER],
    });
  }

  public async delete(id: string) {
    const event = await this.eventRepository.findOne({
      where: { [EVENT_ENTITY_KEYS.ID]: id },
    });

    if (!event) throw new NotFoundException('Event not found');

    await this.eventRepository.save({
      ...event,
      [EVENT_ENTITY_KEYS.STATUS]: EVENT_STATUSES.DELETED,
    });
  }
}
