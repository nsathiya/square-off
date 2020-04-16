import * as React from 'react';
import { PureComponent } from 'react';
import Header from '../Header';
import PatientList from '../PatientList';
import CreatePatient from '../CreatePatient';
import FriendsList from '../FriendsList';
import { Switch, Route } from 'react-router-dom';

const App = () =>
  <div>
    <div>
      <Switch>
        <Route exact={true} path="/friends-list" component={FriendsList} />
      </Switch>
    </div>
  </div>;

export default App;
