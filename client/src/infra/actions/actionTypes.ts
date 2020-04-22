import {
  ISignUpSuccessAction,
  ISignUpInProgressAction,
  ISignUpFailAction,
  ILogInSuccessAction,
  FailAction,
  InProgressAction,
  SuccessAction,
} from './index';

type ActionTypes =
  | ISignUpSuccessAction
  | ISignUpInProgressAction
  | ISignUpFailAction
  | ILogInSuccessAction
  | FailAction
  | InProgressAction
  | SuccessAction;

export default ActionTypes;
