import * as React from 'react';
// TODO
import { useState, PureComponent, Dispatch, SetStateAction } from 'react';
import FriendsList from '../FriendsList';
import SignUp from '../Auth/SignUp';
import LogIn from '../Auth/LogIn';
import ChallengeList from '../Challenge/ChallengeList';
import ChallengeCreator from '../Challenge/ChallengeCreate/ChallengeCreator';
import ChallengeProfile from '../Challenge/ChallengeProfile';
import ActivityPage from '../Activity/ActivitiesPage';
import ActivityCreator from '../Activity/ActivityCreate/ActivityCreator';
import withAuthenticatedUser from '../Auth/withAuthentication';
import { Switch, Route } from 'react-router-dom';
import * as firebase from 'firebase';
import firebaseConfig from '../../infra/config/firebase.staging';

firebase.initializeApp(firebaseConfig);
console.log('firebase', firebase);

export const AuthContext = React.createContext({
  isLoggedIn: false,
  setLoggedIn: null as any,
});

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const context = {
    value: { isLoggedIn, setLoggedIn }
  };
  return (
    <div>
      <div>
        <AuthContext.Provider value={context.value}>
          <Switch>
            <Route exact={true} path="/sign-up" component={SignUp} />
            <Route exact={true} path="/log-in" component={LogIn} />
            <Route exact={true} path="/" component={withAuthenticatedUser(ChallengeList)} />
            <Route exact={true} path="/friends" component={withAuthenticatedUser(FriendsList)} />
            <Route exact={true} path="/challenges" component={withAuthenticatedUser(ChallengeList)} />
            <Route exact={true} path="/challenges/:id" component={withAuthenticatedUser(ChallengeProfile)} />
            <Route exact={true} path="/challenges-create" component={withAuthenticatedUser(ChallengeCreator)} />
            <Route exact={true} path="/activities" component={withAuthenticatedUser(ActivityPage)} />
            <Route exact={true} path="/activities-create" component={withAuthenticatedUser(ActivityCreator)} />
          </Switch>
        </AuthContext.Provider>
      </div>
    </div>
  );
};

export default App;
