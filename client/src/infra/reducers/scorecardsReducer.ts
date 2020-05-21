import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { Scorecard } from '../types';

export type ScorecardsState = { [id: string]: Scorecard };

const initialState: ScorecardsState = {};

export function scorecardsReducer(
  state: ScorecardsState = initialState,
  action: ActionTypes
): ScorecardsState {
  switch (action.type) {
    case ActionTypeKeys.ADD_SCORECARD:
      const { scorecard } = action.payload;
      return Object.assign({}, state, { [scorecard!.id]: { ...scorecard } });
    default:
      return state;
  }
}
