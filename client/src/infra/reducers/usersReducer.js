import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { UserState } from './userReducer';

export type UsersState = UserState[];

const initialState: UsersState = []

export function usersReducer(
  state: UsersState = initialState,
  action: ActionTypes
): UserState {
  switch (action.type) {
    case ActionTypeKeys.ALL_USERS:
      return action.payload.users.map(user => ({
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
      }));
    default:
      return state;
  }
}
