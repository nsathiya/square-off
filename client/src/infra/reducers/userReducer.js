import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';

export type UserState = {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  activities: Array<string>;
  isAuthenticated: boolean;
};

const initialState: UserState = {};

export function userReducer(
  state: UserState = initialState,
  action: ActionTypes
): UserState {
  switch (action.type) {
    case ActionTypeKeys.SIGNUP_SUCCESS:
    case ActionTypeKeys.LOGIN_SUCCESS:
      const user = action.payload.user;
      return {
        id: user.id,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        isAuthenticated: true,
      };
    case ActionTypeKeys.LOGOUT_SUCCESS:
      return initialState;
    default:
      return state;
  }
}
