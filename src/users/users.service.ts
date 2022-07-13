import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import UserEntity, {
  USER_ENTITY_KEYS,
  USER_STATUSES,
} from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './user-dto';
import { DB_ERROR_CODES } from '../db/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<Array<UserEntity>> {
    return this.usersRepository.find({
      where: {
        [USER_ENTITY_KEYS.STATUS]: Not(In([USER_STATUSES.DELETED])),
      },
    });
  }

  public async findById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { [USER_ENTITY_KEYS.ID]: id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  public async findOne(
    criteria:
      | FindOptionsWhere<UserEntity>
      | Array<FindOptionsWhere<UserEntity>>,
  ): Promise<UserEntity | false> {
    const user = this.usersRepository.findOne({
      where: criteria,
    });

    if (!user) return false;

    return user;
  }

  public async findIfRefreshToken(
    refreshToken: string,
    criteria:
      | FindOptionsWhere<UserEntity>
      | Array<FindOptionsWhere<UserEntity>>,
  ): Promise<UserEntity | false> {
    const user = await this.findOne(criteria);

    if (!user) return false;

    if (user[USER_ENTITY_KEYS.REFRESH_TOKEN] === refreshToken) return user;
  }

  public async setRefreshToken(userId: number, refreshToken: string) {
    return await this.usersRepository.update(userId, {
      [USER_ENTITY_KEYS.REFRESH_TOKEN]: refreshToken,
    });
  }

  public async create(createDto: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.create(createDto);

    return await this.usersRepository.save(user).catch((err: any) => {
      if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT)
        throw new ConflictException('User already exists');
      else throw new InternalServerErrorException("Can't create user");
    });
  }

  public async update(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        [USER_ENTITY_KEYS.ID]: parseInt(id),
        [USER_ENTITY_KEYS.STATUS]: Not(In([USER_STATUSES.DELETED])),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository
      .update(id, { ...updateDto })
      .catch((err: any) => {
        if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT)
          throw new ConflictException('User already exists');
        else throw new InternalServerErrorException("Can't update user");
      });

    return await this.usersRepository.findOne({
      where: { [USER_ENTITY_KEYS.ID]: parseInt(id) },
    });
  }

  public async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { [USER_ENTITY_KEYS.ID]: parseInt(id) },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.usersRepository.save({
      ...user,
      [USER_ENTITY_KEYS.STATUS]: USER_STATUSES.DELETED,
    });
  }
}
