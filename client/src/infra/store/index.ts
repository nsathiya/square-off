import { combineReducers } from 'redux';
import { userReducer, UserState } from '../reducers/userReducer';
import { usersReducer, UsersState } from '../reducers/usersReducer';
import { friendsReducer, FriendsState } from '../reducers/friendsReducer';

export interface IStoreState {
  readonly user: UserState;
  readonly users: UsersState;
  readonly friends: FriendsState;
  // TODO readonly isAuthenticated: boolean;
}

export const rootReducer = combineReducers({
  user: userReducer,
  users: usersReducer,
  friends: friendsReducer
});
