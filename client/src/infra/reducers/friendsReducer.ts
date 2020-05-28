import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { UserState } from './userReducer';

export type FriendsState = { [key: string]: UserState };

const initialState: FriendsState = {};

// export function friendsReducer(
//   state: FriendsState = initialState,
//   action: ActionTypes
// ): FriendsState {
//   switch (action.type) {
//     case ActionTypeKeys.ADD_FRIEND:
//       const { friend } = action.payload;
//       return Object.assign({}, state, { [friend!.id]: friend });
//     default:
//       return state;
//   }
// }
