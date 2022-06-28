import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { EventsService } from './events.service';
import SentryInterceptor from '../common/interceptors/sentry.interceptor';
import { instanceToPlain } from 'class-transformer';
import { QueryFailedError } from 'typeorm';
import { DB_ERROR_CODES } from '../db/constants';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateEventDto, UpdateEventDto } from './events-dto';
import { ValidationPipe } from '../common/pipe/validation.pipe';
import { Request } from 'express';

@UseInterceptors(SentryInterceptor)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async getEvents() {
    const events = await this.eventsService.findAll();

    if (!events.length) throw new NotFoundException('No events found');

    return instanceToPlain(events);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async getEvent(@Param('id') id: string) {
    const event = await this.eventsService
      .findOne(id)
      .catch((err: QueryFailedError) => {
        if (err.driverError.code === DB_ERROR_CODES.INVALID_TEXT_REPRESENTATION)
          throw new BadRequestException('Invalid event ID');
        else throw new InternalServerErrorException('Internal server error');
      });

    if (!event) throw new NotFoundException('Event not found');

    return instanceToPlain(event);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async createEvent(
    @Req() req: Request,
    @Body() createEventDto: CreateEventDto,
  ) {
    const event = await this.eventsService.create(req, createEventDto);

    return instanceToPlain(event);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  public async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventsService.update(id, updateEventDto);

    return instanceToPlain(event);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  public async deleteEvent(@Param('id') id: string) {
    await this.eventsService.delete(id);
  }
}
