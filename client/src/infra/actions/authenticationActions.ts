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
} from '../api';
import IStoreState from '../store/IStoreState';
import keys from './actionTypesKeys';
import { Challenge } from '../types';

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
      dispatch(Success(keys.ALL_USERS, { users }));
    } catch (err) {
      dispatch(Fail(err));
    }
  };
}

export function getFriends(userId: string): (dispatch: ThunkDispatch<{}, void, Action>) => void {
  return async (dispatch: ThunkDispatch<{}, void, Action>) => {
    dispatch(InProgress());

    try {
      const friends = await getFriendslistApi(userId);
      // TODO change type of friend
      friends.forEach((friend: any) => {
        dispatch(Success(keys.ADD_FRIEND, { friend }));
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
      const friend = await createFriendshipApi(userId, userIdForFriend);
      dispatch(Success(keys.ADD_FRIEND, { friend }));
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
