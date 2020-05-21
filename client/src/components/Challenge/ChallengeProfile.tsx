import * as React from 'react';
import { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ChallengeSummary from './ChallengeSummary';
import ChallengeLeaderboard from './ChallengeLeaderboard';
import ChallengeActivities from './ChallengeActivities';
import { withMain } from '../Main/withMain';
import { UserState } from '../../infra/reducers/userReducer';
import { FriendsState } from '../../infra/reducers/friendsReducer';
import { ChallengesState } from '../../infra/reducers/challengesReducer';
import { Challenge, ChallengeStatus } from '../../infra/types';
import { IStoreState } from '../../infra/store';
import {
  getDetailsOfChallenge,
  getActivitiesOfChallenge,
  getScorecardsOfChallenge,
} from '../../infra/actions/authenticationActions';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory, useParams } from 'react-router-dom';

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
};

type DispatchProps = {
  getDetailsOfChallenge: (challengeId: string) => (dispatch: Dispatch<any>) => Promise<void>;
  getActivitiesOfChallenge: (challengeId: string) => (dispatch: Dispatch<any>) => Promise<void>;
  getScorecardsOfChallenge: (challengeId: string) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const ChallengeProfile = (props: Props) => {
    const classes = useStyles();
    const { id } = useParams();

    console.log('rendering challenge profile');

    useEffect(
      () => {
        if (id) {
          props.getDetailsOfChallenge(id);
          props.getActivitiesOfChallenge(id);
          props.getScorecardsOfChallenge(id);
        }
      },
      []
    );

    return (
      <Grid
        container={true}
        direction={'column'}
      >
        <Grid container={true} direction={'row'} justify={'center'} >
          <ChallengeSummary challengeId={id!} />
          <ChallengeLeaderboard challengeId={id!} />
        </Grid>
        <Grid container={true} direction={'row'} justify={'center'} >
          <ChallengeActivities challengeId={id!} />
        </Grid>
      </Grid>
    );
};

function mapStateToProps (state: IStoreState): StateProps {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    getDetailsOfChallenge: (id: string): any => { dispatch(getDetailsOfChallenge(id)); },
    getActivitiesOfChallenge: (id: string): any => { dispatch(getActivitiesOfChallenge(id)); },
    getScorecardsOfChallenge: (id: string): any => { dispatch(getScorecardsOfChallenge(id)); },
  };
}

const component = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ChallengeProfile);
export default withMain(component);
