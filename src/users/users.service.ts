import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Not, Repository } from 'typeorm';
import UserEntity, { USER_STATUSES } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './user-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<Array<UserEntity>> {
    return this.usersRepository.find({
      where: {
        status: Not(In([USER_STATUSES.DELETED])),
      },
    });
  }

  public async findById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id },
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

    if (user.refresh_token === refreshToken) return user;
  }

  public async setRefreshToken(userId: number, refreshToken: string) {
    return await this.usersRepository.update(userId, {
      refresh_token: refreshToken,
    });
  }

  public async create(createDto: CreateUserDto): Promise<UserEntity> {
    const { email } = createDto;

    const usersInDb = await this.usersRepository.find({
      where: { email },
    });

    if (usersInDb.length > 0)
      throw new ConflictException('User already exists');

    const user: UserEntity = await this.usersRepository.create(createDto);
    await this.usersRepository.save(user);
    return user;
  }

  public async update(
    id: string,
    updateDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!user) throw new NotFoundException('User not found');

    return await this.usersRepository.save({
      ...user,
      ...updateDto,
    });
  }

  public async delete(id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.status === USER_STATUSES.DELETED)
      throw new ConflictException('User already deleted');

    user.status = USER_STATUSES.DELETED;
    await this.usersRepository.save(user);
  }
}
