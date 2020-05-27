import * as React from 'react';
import { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { UserState } from '../../infra/reducers/userReducer';
import { FriendsState } from '../../infra/reducers/friendsReducer';
import { ChallengesState } from '../../infra/reducers/challengesReducer';
import { Challenge, ChallengeStatus } from '../../infra/types';
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
    title: {
      color: '#674EFF',
    },
}));

type StateProps = {
  readonly user?: UserState;
  readonly friends: FriendsState;
  readonly challenge: Challenge;
};

type DispatchProps = {};

type OwnProps = {
  challengeId: string,
};

type Props = StateProps & DispatchProps & OwnProps;

const ChallengeSummary = ({friends, challenge, user }: Props) => {
    const classes = useStyles();
    const history = useHistory();
    if (!challenge) {
      return (
        <Card className={classes.root} />
      );
    }
    return (
      <Card className={classes.root}>

        <CardHeader
          classes={{
            title: classes.title,
          }}
          title={challenge.name}
        />
        <CardContent>
          <Typography variant="body1" component="p">
            Exercise Type: {challenge.exercise}
          </Typography>
          <Typography variant="body1" component="p">
            Start Time: {challenge.startTime}
          </Typography>
          <Typography variant="body1" component="p">
            End Time: {challenge.endTime}
          </Typography>
          <Typography variant="body1" component="p">
            Measured in: {challenge.metric}
          </Typography>
          <Typography variant="body1" component="p">
            Participants: {challenge.participants}
          </Typography>
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
    challenge
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {};
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ChallengeSummary);
