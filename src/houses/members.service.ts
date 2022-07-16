import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import HouseEntity, { HOUSE_ENTITY_KEYS } from '../entities/house.entity';
import { Repository } from 'typeorm';
import { AddHouseMemberDto, DeleteHouseMemberDto } from './houses-dto';
import UserEntity, { USER_ENTITY_KEYS } from '../entities/user.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(HouseEntity)
    private readonly housesRepository: Repository<HouseEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  public async findAll(houseId: string) {
    const house = await this.housesRepository.findOne({
      where: {
        [HOUSE_ENTITY_KEYS.ID]: houseId,
      },
      relations: [HOUSE_ENTITY_KEYS.MEMBERS],
    });

    if (!house) throw new NotFoundException('House not found');

    return house[HOUSE_ENTITY_KEYS.MEMBERS];
  }

  public async addMember(houseId: string, addHouseMember: AddHouseMemberDto) {
    const house = await this.housesRepository.findOne({
      where: {
        [HOUSE_ENTITY_KEYS.ID]: houseId,
      },
      relations: [HOUSE_ENTITY_KEYS.MEMBERS],
    });

    if (!house) throw new NotFoundException('House not found');

    const user = await this.usersRepository.findOne({
      where: {
        [USER_ENTITY_KEYS.ID]: addHouseMember.user_id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isAlreadyMember = house.members.find(
      (member: UserEntity) =>
        member[USER_ENTITY_KEYS.ID] === user[USER_ENTITY_KEYS.ID],
    );

    if (isAlreadyMember)
      throw new UnprocessableEntityException(
        'User is already a member of this house',
      );

    house[HOUSE_ENTITY_KEYS.MEMBERS].push(user);

    await this.housesRepository.save(house);

    return await this.housesRepository.findOne({
      where: {
        [HOUSE_ENTITY_KEYS.ID]: houseId,
      },
      relations: [HOUSE_ENTITY_KEYS.MEMBERS],
    });
  }

  public async deleteMember(
    houseId: string,
    deleteHouseMember: DeleteHouseMemberDto,
  ) {
    const house = await this.housesRepository.findOne({
      where: {
        [HOUSE_ENTITY_KEYS.ID]: houseId,
      },
      relations: [HOUSE_ENTITY_KEYS.MEMBERS],
    });

    if (!house) throw new NotFoundException('House not found');

    const user = await this.usersRepository.findOne({
      where: {
        [USER_ENTITY_KEYS.ID]: deleteHouseMember.user_id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isMember = house.members.find(
      (member: UserEntity) =>
        member[USER_ENTITY_KEYS.ID] === user[USER_ENTITY_KEYS.ID],
    );

    if (!isMember)
      throw new UnprocessableEntityException(
        'User is not a member of this house',
      );

    house[HOUSE_ENTITY_KEYS.MEMBERS] = house[HOUSE_ENTITY_KEYS.MEMBERS].filter(
      (member: UserEntity) =>
        member[USER_ENTITY_KEYS.ID] !== user[USER_ENTITY_KEYS.ID],
    );

    await this.housesRepository.save(house);
  }
}
