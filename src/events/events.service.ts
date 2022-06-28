import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import EventEntity, {
  EVENT_FOREIGN_KEYS,
  EVENT_STATUSES,
} from '../entities/event.entity';
import { In, Not, QueryFailedError, Repository } from 'typeorm';
import { CreateEventDto, UpdateEventDto } from './events-dto';
import { Request } from 'express';
import UserEntity from '../entities/user.entity';
import { DB_ERROR_CODES } from '../db/constants';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  public async findAll(): Promise<Array<EventEntity>> {
    return await this.eventRepository.find({
      where: { status: Not(In([EVENT_STATUSES.DELETED])) },
      relations: ['house', 'owner'],
    });
  }

  public async findOne(id: string): Promise<EventEntity> {
    return await this.eventRepository.findOne({
      where: {
        id,
        status: Not(In([EVENT_STATUSES.DELETED])),
      },
      relations: ['house', 'owner'],
    });
  }

  public async create(
    request: Request,
    createDto: CreateEventDto,
  ): Promise<EventEntity> {
    const event = this.eventRepository.create({
      ...createDto,
      house: { id: createDto.house },
      owner: { id: (<UserEntity>request.user).id },
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
      where: { id: savedEvent.id },
      relations: ['house', 'owner'],
    });
  }

  public async update(
    id: string,
    updateDto: UpdateEventDto,
  ): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({
      where: { id, status: Not(In([EVENT_STATUSES.DELETED])) },
    });

    if (!event) throw new NotFoundException('Event not found');

    await this.eventRepository
      .update(id, {
        ...updateDto,
        ...(updateDto.house && { house: { id: updateDto.house } }),
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
      where: { id },
      relations: ['house', 'owner'],
    });
  }

  public async delete(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
    });

    if (!event) throw new NotFoundException('Event not found');

    await this.eventRepository.save({
      ...event,
      status: EVENT_STATUSES.DELETED,
    });
  }
}
