import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { EventsService } from './events.service';
import SentryInterceptor from '../common/interceptors/sentry.interceptor';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateEventDto, UpdateEventDto } from './events-dto';
import { ValidationPipe } from '../common/pipe/validation.pipe';
import { Request } from 'express';
import {
  ApiBody,
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
import EventEntity from '../entities/event.entity';

@ApiTags('events')
@ApiCookieAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@UseInterceptors(SentryInterceptor, ClassSerializerInterceptor)
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Events array',
    type: () => EventEntity,
    isArray: true,
  })
  public async getEvents() {
    return await this.eventsService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Event',
    type: () => EventEntity,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Event id',
    type: 'string',
    required: true,
  })
  public async getEvent(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    if (!event) throw new NotFoundException('Event not found');

    return event;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({
    description: 'Event created',
    type: () => EventEntity,
    isArray: false,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error',
  })
  @ApiBody({
    description: 'Event',
    type: () => EventEntity,
  })
  public async createEvent(
    @Req() req: Request,
    @Body() createEventDto: CreateEventDto,
  ) {
    return await this.eventsService.create(req, createEventDto);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Event updated',
    type: () => EventEntity,
    isArray: false,
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation error',
  })
  @ApiParam({
    name: 'id',
    description: 'Event id',
    type: 'string',
    required: true,
  })
  @ApiBody({
    description: 'Event',
    type: () => EventEntity,
  })
  public async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventsService.update(id, updateEventDto);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse({
    description: 'Event deleted',
  })
  @ApiNotFoundResponse({
    description: 'Event not found',
  })
  @ApiParam({
    name: 'id',
    description: 'Event id',
    type: 'string',
  })
  public async deleteEvent(@Param('id') id: string) {
    await this.eventsService.delete(id);
  }
}
