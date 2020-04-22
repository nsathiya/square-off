import keys from './actionTypesKeys';

export interface ILogInSuccessAction {
  readonly type: keys.LOGIN_SUCCESS;
  readonly payload: {
    readonly user: {};
  };
}

export interface ILogInProgressAction {
  readonly type: keys.LOGIN_INPROGRESS;
}

export interface ILogInFailAction {
  readonly type: keys.LOGIN_FAIL;
  readonly payload: {
    readonly error: Error;
  };
}

export interface ISignUpSuccessAction {
  readonly type: keys.SIGNUP_SUCCESS;
  readonly payload: {
    readonly user: {};
  };
}

export interface ISignUpInProgressAction {
  readonly type: keys.SIGNUP_INPROGRESS;
}

export interface ISignUpFailAction {
  readonly type: keys.SIGNUP_FAIL;
  readonly payload: {
    readonly error: Error;
  };
}

export interface SuccessAction {
  readonly type: keys;
  readonly payload: {};
}

export interface InProgressAction {
  readonly type: keys.ACTION_INPROGRESS;
}

export interface FailAction {
  readonly type: keys.ACTION_FAIL;
  readonly payload: {
    readonly error: Error;
  };
}
