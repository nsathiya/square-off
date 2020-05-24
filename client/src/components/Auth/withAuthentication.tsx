import * as React from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../App/index';
import { UserState } from '../../infra/reducers/userReducer';
import { compose } from 'redux';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { logIn as logInAction } from '../../infra/actions/authenticationActions';

import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

type StateProps = {
  user: UserState;
};
type OwnProps = {};
type DispatchProps = {
  logIn: (username: string, password: string) => (dispatch: React.Dispatch<any>) => Promise<void>;
};
type Props = StateProps & OwnProps & DispatchProps;

const withAuthenticatedUser = (WrappedComponent: React.ComponentType<any>): any => {
  return (props: Props) => {
    const history = useHistory();
    const Auth = useContext(AuthContext);
    // const userSessionInCookie = firebase.auth().currentUser;
    const handleUser = (user: any) => {
      if (user) {
        if (!props.user.id) {
          // hack for now, we are storing username to match as its unique;
          const username = user.displayName;
          // we are not storing password in db, Firebase handles authentication;
          const password = 'N/A';
          props.logIn(username!, password);
        }
        Auth.setLoggedIn(true);
      } else {
        Auth.setLoggedIn(false);
        history.push('/log-in');
      }
    };
    firebase.auth().onAuthStateChanged(handleUser);
    return <WrappedComponent />;
  };
};

const mapStateToProps = (state: StateProps) => {
  return {
    user: state.user
  };
};

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    logIn: (username: string, password: string): any => { dispatch(logInAction(username, password)); }
  };
}

const composedAuthenticatedUser = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuthenticatedUser,
);

export default composedAuthenticatedUser;
