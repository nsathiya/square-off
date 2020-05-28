import * as React from 'react';
import { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import { withMain } from '../Main/withMain';
import { UserState } from '../../infra/reducers/userReducer';
import { UsersState } from '../../infra/reducers/usersReducer';
import { ActivitiesState } from '../../infra/reducers/activitiesReducer';
import { Activity } from '../../infra/types';
import { IStoreState } from '../../infra/store';

import {
  getActivities as getActivitiesApi
} from '../../infra/actions/authenticationActions';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  addButton: {
    margin: 16,
    backgroundColor: '#674EFF',
    color: '#FFFFFF'
  },
}));

type StateProps = {
  readonly user?: UserState;
  readonly users: UsersState;
  readonly activities: ActivitiesState;
};

type DispatchProps = {
  getActivitiesOfUser: (userId: string) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const getActivities = (userActivities: '' | string[] | undefined, activities: ActivitiesState): Array<any> => {
  if (!userActivities || userActivities.length === 0) {
    return [];
  }
  return userActivities.map((activityId: string) => {
    const activity = activities[activityId];
    return (
      <ListItem key={activity.id}>
        <ListItemAvatar>
          <Avatar>
            <DirectionsRunIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={activity.name} secondary={activity.startTime} />
      </ListItem>
    );
  });
};

const ActivitiesPage = (props: Props) => {
    const classes = useStyles();
    const history = useHistory();
    const userId = props.user && props.user.id;
    const userActivities = userId && props.users[userId] && props.users[userId].activities;
    const activities = getActivities(userActivities, props.activities);
    useEffect(
      () => {
        if (userId) {
          props.getActivitiesOfUser(userId);
        }
      },
      [userId]
    );

    const createActivity = () => history.push('/activities-create');

    return (
      <Grid container={true} direction={'column'} >
        <Grid container={true} direction={'row'} justify={'center'} >
        {
          (activities.length > 0) ?
          (
            <Grid item={true} sm={8}>
              <List className={classes.root}>
                {activities}
              </List>
            </Grid>
          ) :
          (
            <Typography variant="body1" gutterBottom={true}>
              No activities to display. Upload some to get started!
            </Typography>
          )
        }
        </Grid>
        <Grid container={true} direction={'row'} justify={'center'} >
          <Fab
            className={classes.addButton}
            variant="extended"
            aria-label="add"
            onClick={createActivity}
          >
            Create Activity
          </Fab>
        </Grid>
      </Grid>
    );
};

function mapStateToProps (state: IStoreState): StateProps {
  return {
    user: state.user,
    users: state.users,
    activities: state.activities,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    getActivitiesOfUser: (userId: string): any => { dispatch(getActivitiesApi(userId)); },
  };
}

const component = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ActivitiesPage);
export default withMain(component);
