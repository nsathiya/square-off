import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { UserState } from './userReducer';

export type UsersState = { [id: string]: UserState };

const initialState: UsersState = {}

export function usersReducer(
  state: UsersState = initialState,
  action: ActionTypes
): UserState {
  switch (action.type) {
    // case ActionTypeKeys.ALL_USERS:
    //   return action.payload.users.forEach(user => ({
    //     id: user.id,
    //     username: user.username,
    //     firstName: user.first_name,
    //     lastName: user.last_name,
    //     email: user.email,
    //     phoneNumber: user.phone_number,
    //   }));
    case ActionTypeKeys.ADD_USER:
      const { user } = action.payload;
      return Object.assign({}, state, { [user.id]: user});
    case ActionTypeKeys.EDIT_USER:
      const { userId, key, value } = action.payload;
      const currentUser = state[userId];
      const newUser = Object.assign({}, currentUser, { [key]: value });
      return Object.assign({}, state, { [userId]: newUser });
    default:
      return state;
  }
}
