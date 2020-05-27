
import * as React from 'react';
import { useEffect } from 'react';
import List from '@material-ui/core/List';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import NavigationIcon from '@material-ui/icons/Navigation';
import { makeStyles } from '@material-ui/core/styles';
import ChallengeRow from './ChallengeRow';
import { withMain } from '../Main/withMain';
import { UserState } from '../../infra/reducers/userReducer';
import { FriendsState } from '../../infra/reducers/friendsReducer';
import { ChallengesState } from '../../infra/reducers/challengesReducer';
import { Challenge, ChallengeStatus } from '../../infra/types';
import { IStoreState } from '../../infra/store';
import {
  getChallenges as getChallengesApi,
  getFriends as getFriendsApi,
} from '../../infra/actions/authenticationActions';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    panel: {
      width: '100%',
      maxWidth: 600,
      // margin: '0 auto',
      marginBottom: 8,
      backgroundColor: 'transparent'
    },
    panelExpanded: {
      width: '100%',
      maxWidth: 600,
      // margin: '0 auto',
      marginBottom: 8,
      backgroundColor: 'transparent'
    },
    panelDetails: {
      maxHeight: 400,
      overflow: 'auto'
    },
    addButton: {
      margin: 0,
      backgroundColor: '#674EFF',
      color: '#FFFFFF'
    }
}));

type StateProps = {
  readonly user?: UserState;
  readonly friends: FriendsState;
  readonly challenges: ChallengesState;
};

type DispatchProps = {
  getChallenges: (userId: string) => (dispatch: Dispatch<any>) => Promise<void>;
  getFriends: (userId: string) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const getActiveChallenges = (challenges: ChallengesState, friends: FriendsState): any => {
  const activeChallenges = Object
                            .values(challenges)
                            .filter(challenge => challenge.status === ChallengeStatus.ACTIVE);
  if (activeChallenges.length === 0) {
    return (
      <Typography variant="body2">
        No active challenges
      </Typography>
    );
  }
  return activeChallenges
          .map((challenge: Challenge) => (
            <ChallengeRow
              key={challenge.id!}
              challenge={challenge}
            />
          ));
};

const getUpcomingChallenges = (challenges: ChallengesState, friends: FriendsState): any => {
  const inProgressChallenges = Object
                            .values(challenges)
                            .filter(challenge => challenge.status === ChallengeStatus.HAVE_NOT_STARTED);
  if (inProgressChallenges.length === 0) {
    return (
      <Typography variant="body2">
        No challenges in progress
      </Typography>
    );
  }
  return inProgressChallenges
          .map((challenge: Challenge) => (
            <ChallengeRow
              key={challenge.id!}
              challenge={challenge}
            />
          ));
};

const getCompletedChallenges = (challenges: ChallengesState, friends: FriendsState): any => {
  const completedChallenges = Object
                            .values(challenges)
                            .filter(challenge => challenge.status === ChallengeStatus.FINISHED);
  if (completedChallenges.length === 0) {
    return (
      <Typography variant="body2">
        No completed challenges
      </Typography>
    );
  }
  return completedChallenges
          .map((challenge: Challenge) => (
            <ChallengeRow
              key={challenge.id!}
              challenge={challenge}
            />
          ));
};

const ChallengeList = ({getChallenges, getFriends, friends, challenges, user }: Props) => {
    const classes = useStyles();
    const history = useHistory();

    useEffect(
      () => {
        if (user && user.id) {
          console.log('getting challenges!');
          getChallenges(user.id);
          getFriends(user.id);
        }
      },
      [user!.id]
    );

    const activeChallenges = getActiveChallenges(challenges, friends);
    const upcomingChallenges = getUpcomingChallenges(challenges, friends);
    const completedChallenges = getCompletedChallenges(challenges, friends);

    const createChallenge = () => history.push('/challenges-create');

    return (
      <Grid
        container={true}
        direction={'column'}
      >
      <Grid container={true} direction={'row'} justify={'center'} >
        <ExpansionPanel className={classes.panel} elevation={0}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Active</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.panelDetails}>
              <List>
                {activeChallenges}
              </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
      <Grid container={true} direction={'row'} justify={'center'} >
        <ExpansionPanel className={classes.panel} elevation={0}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Upcoming</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.panelDetails}>
              <List>
                {upcomingChallenges}
              </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
      <Grid container={true} direction={'row'} justify={'center'} >
        <ExpansionPanel className={classes.panel} elevation={0}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography>Completed</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.panelDetails}>
              <List>
                {completedChallenges}
              </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
      <Grid container={true} direction={'row'} justify={'center'} >
        <Fab
          className={classes.addButton}
          variant="extended"
          aria-label="add"
          onClick={createChallenge}
        >
          Create Challenge
        </Fab>
      </Grid>
      </Grid>
    );
};

function mapStateToProps (state: IStoreState): StateProps {
  console.log('friends', state.friends);
  console.log('challenges', state.challenges);
  return {
    user: state.user,
    friends: state.friends,
    challenges: state.challenges,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    getChallenges: (userId: string): any => { dispatch(getChallengesApi(userId)); },
    getFriends: (userId: string): any => { dispatch(getFriendsApi(userId)); },
  };
}

const component = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ChallengeList);
export default withMain(component);
