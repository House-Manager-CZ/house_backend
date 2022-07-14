import UserEntity, { USER_ENTITY_KEYS } from '../../entities/user.entity';

export const checkAdminUser = (user: UserEntity): boolean => {
  return (
    user[USER_ENTITY_KEYS.USERNAME] &&
    user[USER_ENTITY_KEYS.USERNAME] !== '' &&
    user[USER_ENTITY_KEYS.USERNAME] === process.env.ADMIN_USERNAME &&
    user[USER_ENTITY_KEYS.EMAIL] &&
    user[USER_ENTITY_KEYS.EMAIL] !== '' &&
    user[USER_ENTITY_KEYS.EMAIL] === process.env.ADMIN_EMAIL &&
    user[USER_ENTITY_KEYS.PASSWORD] &&
    user[USER_ENTITY_KEYS.PASSWORD] !== ''
  );
};
