import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { Challenge } from '../types';

export type ChallengeState = { id: Challenge };

const initialState: ChallengeState = {};

export function challengeReducer(
  state: ChallengeState = initialState,
  action: ActionTypes
): ChallengeState {
  switch (action.type) {
    case ActionTypeKeys.ADD_CHALLENGE:
      const { challenge } = action.payload;
      return Object.assign({}, state, { [challenge.id]: challenge });
    default:
      return state;
  }
}
