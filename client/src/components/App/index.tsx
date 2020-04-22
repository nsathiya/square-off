import * as React from 'react';
// TODO
import { PureComponent } from 'react';
import FriendsList from '../FriendsList';
import SignUp from '../SignUp';
import LogIn from '../LogIn';
import { Switch, Route } from 'react-router-dom';

const App = () =>
  <div>
    <div>
      <Switch>
        <Route exact={true} path="/friends-list" component={FriendsList} />
        <Route exact={true} path="/sign-up" component={SignUp} />
        <Route exact={true} path="/log-in" component={LogIn} />
      </Switch>
    </div>
  </div>;

export default App;
