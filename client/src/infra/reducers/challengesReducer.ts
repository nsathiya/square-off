import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { Challenge } from '../types';

export type ChallengesState = { [id: string]: Challenge };

const initialState: ChallengesState = {};

export function challengesReducer(
  state: ChallengesState = initialState,
  action: ActionTypes
): ChallengesState {
  switch (action.type) {
    case ActionTypeKeys.ADD_CHALLENGE:
      const { challenge } = action.payload;
      return Object.assign({}, state, { [challenge!.id]: { ...challenge } });
    case ActionTypeKeys.EDIT_CHALLENGE:
      const { key, value, challengeId } = action.payload as any;
      const currentChallenge = state[challengeId] || {};
      const newChallenge = Object.assign({ ...currentChallenge }, { [key]: value });
      return Object.assign({}, state, { [challengeId]: newChallenge });
    default:
      return state;
  }
}
