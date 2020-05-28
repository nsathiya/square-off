import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import {
  logIn as logInApi,
  signUp as signUpApi
} from '../api/authenticationApi';
import {
  getAllUsers as getAllUsersApi,
  createFriendship as createFriendshipApi,
  getFriendslist as getFriendslistApi,
  createChallenge as createChallengeApi,
  getChallenges as getChallengeApi,
  getActivities as getActivitiesApi,
  getDetailsOfChallenge as getDetailsOfChallengeApi,
  getActivitiesOfChallenge as getActivitiesOfChallengeApi,
  getScorecardsOfChallenge as getScorecardsOfChallengeApi,
  createActivity as createActivityApi,
} from '../api';
import keys from './actionTypesKeys';
import { Challenge, Scorecard, Activity, UserRelationships } from '../types';

import {
  ISignUpFailAction,
  ISignUpInProgressAction,
  ISignUpSuccessAction,
  InProgressAction,
  FailAction,
  SuccessAction,
} from './index';

export function signUp(userDetails: {}): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    // Signal work in progress.
    dispatch(signUpInProgress());

    try {
      const user = await signUpApi(userDetails);
      dispatch(signUpSuccess(user));
    } catch (err) {
      dispatch(signUpFail(err));
    }
  };
}

function signUpInProgress(): ISignUpInProgressAction {
  return {
    type: keys.SIGNUP_INPROGRESS
  };
}

function signUpSuccess(user: {}): ISignUpSuccessAction {
  return {
    type: keys.SIGNUP_SUCCESS,
    payload: {
      user
    }
  };
}

function signUpFail(error: Error): ISignUpFailAction {
  return {
    type: keys.SIGNUP_FAIL,
    payload: {
      error
    }
  };
}

function InProgress(): InProgressAction {
  return {
    type: keys.ACTION_INPROGRESS
  };
}

function Fail(error: Error): FailAction {
  return {
    type: keys.ACTION_FAIL,
    payload: {
      error
    }
  };
}

function Success(type: keys, payload: {}): SuccessAction {
  return {
    type,
    payload
  };
}

export function logIn(username: string, password: string )
: (dispatch: ThunkDispatch<{}, void, Action>) => Promise<void> {
  return async (dispatch: Dispatch) => {
    // Signal work in progress.
    dispatch(InProgress());
    try {
      const user = await logInApi(username, password);
      dispatch(Success(keys.LOGIN_SUCCESS, { user }));
      dispatch(Success(keys.ADD_USER, { user }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getAllUsers(): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    // Signal work in progress.
    dispatch(InProgress());

    try {
      const users = await getAllUsersApi();
      users.forEach((userObj: any) => {
        dispatch(Success(keys.ADD_USER, { user: userObj }));
      });
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getFriends(userId: string): (dispatch: ThunkDispatch<{}, void, Action>) => void {
  return async (dispatch: ThunkDispatch<{}, void, Action>) => {
    dispatch(InProgress());

    try {
      const users = await getFriendslistApi(userId);
      // TODO change type of friend
      users.forEach((user: any) => {
        dispatch(Success(keys.ADD_USER, { user }));
      });
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function createFriend(userId: string, userIdForFriend: string): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const user = await createFriendshipApi(userId, userIdForFriend);
      dispatch(Success(keys.ADD_USER, { user }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function createChallenge(challenge: Challenge): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const newChallenge = await createChallengeApi(challenge);
      dispatch(Success(keys.ADD_CHALLENGE, { challenge: newChallenge }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function createActivity(activity: Activity): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const newActivity = await createActivityApi(activity);
      dispatch(Success(keys.ADD_ACTIVITY, { activity: newActivity }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getChallenges(userId: string): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const challenges = await getChallengeApi(userId);
      challenges.forEach((challenge: Challenge) => {
        dispatch(Success(keys.ADD_CHALLENGE, { challenge }));
      });
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getActivities(userId: string): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());
    try {
      const activities = await getActivitiesApi(userId);
      activities.forEach((activity: Activity) => {
        dispatch(Success(keys.ADD_ACTIVITY, { activity }));
      });
      const activityIds = activities.map(activity => activity.id);
      dispatch(Success(keys.EDIT_USER, {
        userId,
        key: 'activities',
        value: activityIds,
      }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getDetailsOfChallenge(challengeId: string): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const challenge = await getDetailsOfChallengeApi(challengeId);
      dispatch(Success(keys.ADD_CHALLENGE, { challenge }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getActivitiesOfChallenge(challengeId: string): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const activities = await getActivitiesOfChallengeApi(challengeId);
      activities.forEach((activity: Activity) => {
        dispatch(Success(keys.ADD_ACTIVITY, { activity }));
      });
      const activityIds = activities.map(activity => activity.id);
      dispatch(Success(keys.EDIT_CHALLENGE, {
        challengeId,
        key: 'activities',
        value: activityIds,
      }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getScorecardsOfChallenge(challengeId: string): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(InProgress());

    try {
      const scorecards = await getScorecardsOfChallengeApi(challengeId);
      scorecards.forEach((scorecard: Scorecard) => {
        dispatch(Success(keys.ADD_SCORECARD, { scorecard }));
      });
      const scorecardsIds = scorecards.map(scorecard => scorecard.id);
      dispatch(Success(keys.EDIT_CHALLENGE, {
        challengeId,
        key: 'scorecards',
        value: scorecardsIds
      }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}
