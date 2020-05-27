import * as React from 'react';
import { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { UserState } from '../../infra/reducers/userReducer';
import { FriendsState } from '../../infra/reducers/friendsReducer';
import { ActivitiesState } from '../../infra/reducers/activitiesReducer';
import { Challenge, ChallengeStatus, Activity } from '../../infra/types';
import { IStoreState } from '../../infra/store';

import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      margin: 8,
      flexGrow: 1,
    },
    table: {

    },
    title: {
      color: '#674EFF',
    },
}));

type StateProps = {
  readonly user?: UserState;
  readonly friends: FriendsState;
  readonly challenge: Challenge;
  readonly activities: ActivitiesState;
};

type DispatchProps = {};

type OwnProps = {
  challengeId: string,
};

type Props = StateProps & DispatchProps & OwnProps;

const ChallengeActivities = ({friends, challenge, activities, user }: Props) => {
    const classes = useStyles();
    if (!challenge) {
      return (
        <Card className={classes.root}>
          <CardHeader
            classes={{ title: classes.title }}
            title="Activities"
          />
        </Card>
      );
    }

    let activitiesToRender: any = [];
    if (challenge.activities) {
      activitiesToRender = challenge.activities!.map(activityId => {
        const activity = activities[activityId];
        let exercise, name, startTime, distance, time = '';
        let caloriesBurned;
        if (activity) {
          const userName = friends[activity.userId] || {};
          name = `${userName!.firstName} ${userName!.lastName}`;
          exercise = activity.exercise;
          startTime = activity.startTime;
          distance = `${activity.distance} ${activity.distanceMetric}`;
          time = `${activity.time} secs`;
          caloriesBurned = activity.caloriesBurned;
        }

        return { name, exercise, startTime, distance, time, caloriesBurned };
      });
    }
    return (
      <Card className={classes.root}>

        <CardHeader
          classes={{ title: classes.title }}
          title="Activities for this challenge"
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Exercise</TableCell>
                  <TableCell align="right">Started At</TableCell>
                  <TableCell align="right">Distance</TableCell>
                  <TableCell align="right">Duration</TableCell>
                  <TableCell align="right">Calories Burned</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activitiesToRender.map((activity: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell component="th" scope="row">{activity.name}</TableCell>
                    <TableCell align="right">{activity.exercise}</TableCell>
                    <TableCell align="right">{activity.startTime}</TableCell>
                    <TableCell align="right">{activity.distance}</TableCell>
                    <TableCell align="right">{activity.duration}</TableCell>
                    <TableCell align="right">{activity.caloriesBurned}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    );
};

function mapStateToProps (state: IStoreState, ownProps: OwnProps): StateProps {
  const challengeId: string = ownProps.challengeId;
  const challenge = state.challenges[challengeId];
  return {
    user: state.user,
    friends: state.friends,
    challenge,
    activities: state.activities,
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, {})(ChallengeActivities);
