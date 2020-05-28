import { UserState } from '../reducers/userReducer';
import { UsersState } from '../reducers/usersReducer';
import { UserRelationships } from '../types';
import { FriendsState } from '../reducers/friendsReducer';
import { IStoreState } from './index';

export const extractFriends = (state: IStoreState) => {
  const friends: FriendsState = {};

  Object.values(state.users).forEach(user => {
    if (user.relationship === UserRelationships.FRIEND) {
      friends[user.id] = user;
    }
  });
  return friends;
};
