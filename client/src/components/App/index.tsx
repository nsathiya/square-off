import * as React from 'react';
// TODO
import { PureComponent } from 'react';
import FriendsList from '../FriendsList';
import SignUp from '../SignUp';
import LogIn from '../LogIn';
import ChallengeList from '../Challenge/ChallengeList';
import ChallengeCreator from '../Challenge/ChallengeCreate/ChallengeCreator';
import ChallengeProfile from '../Challenge/ChallengeProfile';
import ActivityPage from '../Activity/ActivitiesPage';
import ActivityCreator from '../Activity/ActivityCreate/ActivityCreator';
import { Switch, Route } from 'react-router-dom';

const App = () =>
  <div>
    <div>
      <Switch>
        <Route exact={true} path="/friends" component={FriendsList} />
        <Route exact={true} path="/sign-up" component={SignUp} />
        <Route exact={true} path="/log-in" component={LogIn} />
        <Route exact={true} path="/challenges" component={ChallengeList} />
        <Route exact={true} path="/challenges/:id" component={ChallengeProfile} />
        <Route exact={true} path="/challenges-create" component={ChallengeCreator} />
        <Route exact={true} path="/activities" component={ActivityPage} />
        <Route exact={true} path="/activities-create" component={ActivityCreator} />
      </Switch>
    </div>
  </div>;

export default App;
