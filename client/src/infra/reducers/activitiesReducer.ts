import ActionTypeKeys from '../actions/actionTypesKeys';
import ActionTypes from '../actions/actionTypes';
import { Activity } from '../types';

export type ActivitiesState = { [id: string]: Activity };

const initialState: ActivitiesState = {};

export function activitiesReducer(
  state:  ActivitiesState = initialState,
  action: ActionTypes
): ActivitiesState {
  switch (action.type) {
    case ActionTypeKeys.ADD_ACTIVITY:
      const { activity } = action.payload;
      return Object.assign({}, state, { [activity!.id]: { ...activity } });  
    default:
      return state;
  }
}
