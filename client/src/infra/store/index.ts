import { combineReducers } from 'redux';
import { userReducer, UserState } from '../reducers/userReducer';
import { usersReducer, UsersState } from '../reducers/usersReducer';
import { friendsReducer, FriendsState } from '../reducers/friendsReducer';
import { challengesReducer, ChallengesState } from '../reducers/challengesReducer';

export interface IStoreState {
  readonly user: UserState;
  readonly users: UsersState;
  readonly friends: FriendsState;
  readonly challenges: ChallengesState;
  // TODO readonly isAuthenticated: boolean;
}

export const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  friends: friendsReducer,
  challenges: challengesReducer,
});
