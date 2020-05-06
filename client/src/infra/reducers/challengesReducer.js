import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { Challenge } from '../types';

export type ChallengesState = { id: Challenge };

const initialState: ChallengesState = {};

export function challengesReducer(
  state: ChallengeState = initialState,
  action: ActionTypes
): ChallengesState {
  switch (action.type) {
    case ActionTypeKeys.ADD_CHALLENGE:
      const { challenge } = action.payload;
      return Object.assign({}, state, { [challenge.id]: challenge });
    default:
      return state;
  }
}
