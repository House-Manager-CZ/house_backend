import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
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

    return await this.usersRepository.save<UserEntity>({
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
