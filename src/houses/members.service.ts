import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddHouseMemberDto, DeleteHouseMemberDto } from './houses-dto';
import HouseMemberEntity, {
  HOUSE_MEMBER_ENTITY_KEYS,
  HOUSE_MEMBER_FOREIGN_KEYS,
} from '../entities/houseMember.entity';
import { DB_ERROR_CODES } from '../db/constants';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(HouseMemberEntity)
    private readonly houseMemberRepository: Repository<HouseMemberEntity>,
  ) {}

  public async findAll(houseId: string): Promise<Array<HouseMemberEntity>> {
    return await this.houseMemberRepository.find({
      where: {
        [HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID]: houseId,
      },
      relations: [HOUSE_MEMBER_ENTITY_KEYS.USER],
    });
  }

  public async addMember(
    houseId: string,
    addHouseMember: AddHouseMemberDto,
  ): Promise<Array<HouseMemberEntity>> {
    await this.houseMemberRepository
      .insert({
        [HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID]: houseId,
        [HOUSE_MEMBER_ENTITY_KEYS.USER_ID]: addHouseMember.user_id,
      })
      .catch((err: any) => {
        if (err.code === DB_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
          if (err.constraint === HOUSE_MEMBER_FOREIGN_KEYS.HOUSE)
            throw new UnprocessableEntityException('House not found');
          else if (err.constraint === HOUSE_MEMBER_FOREIGN_KEYS.USER)
            throw new UnprocessableEntityException('User not found');
        } else if (err.code === DB_ERROR_CODES.UNIQUE_CONSTRAINT) {
          throw new UnprocessableEntityException('User is already a member');
        }

        throw new InternalServerErrorException("Can't add member");
      });

    return this.houseMemberRepository.find({
      where: {
        [HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID]: houseId,
      },
      relations: [HOUSE_MEMBER_ENTITY_KEYS.USER],
    });
  }

  public async deleteMember(
    houseId: string,
    deleteHouseMember: DeleteHouseMemberDto,
  ) {
    return await this.houseMemberRepository.delete({
      [HOUSE_MEMBER_ENTITY_KEYS.HOUSE_ID]: houseId,
      [HOUSE_MEMBER_ENTITY_KEYS.USER_ID]: deleteHouseMember.user_id,
    });
  }
}
