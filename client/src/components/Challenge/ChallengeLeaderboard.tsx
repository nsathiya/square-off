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
import { UsersState } from '../../infra/reducers/usersReducer';
import { ChallengesState } from '../../infra/reducers/challengesReducer';
import { ScorecardsState } from '../../infra/reducers/scorecardsReducer';
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
    table: {

    },
    title: {
      color: '#674EFF',
    },
}));

type StateProps = {
  readonly user?: UserState;
  readonly users: UsersState;
  readonly challenge: Challenge;
  readonly scorecards: ScorecardsState;
};

type DispatchProps = {};

type OwnProps = {
  challengeId: string,
};

type Props = StateProps & DispatchProps & OwnProps;

const ChallengeLeaderboard = ({users, challenge, scorecards, user }: Props) => {
    const classes = useStyles();
    if (!challenge) {
      return (
        <Card className={classes.root} />
      );
    }

    let scorecardsToRender: any = [];
    if (challenge.scorecards) {
      scorecardsToRender = challenge.scorecards!.map(scorecardId => {
        const score = scorecards[scorecardId].score;
        const userName = users[scorecards[scorecardId].userId] || {};
        const name = `${userName!.firstName} ${userName!.lastName}`;
        return { name, score };
      });
      scorecardsToRender.sort((a: {score: number}, b: {score: number}) => (b.score - a.score));
    }
    return (
      <Card className={classes.root}>

        <CardHeader
          classes={{ title: classes.title }}
          title="Leaderboard"
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell align="right">Name</TableCell>
                  <TableCell align="right">Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scorecardsToRender.map((scorecard: any, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell component="th" scope="row">
                      {idx + 1}
                    </TableCell>
                    <TableCell align="right">{scorecard.name}</TableCell>
                    <TableCell align="right">{scorecard.score}</TableCell>
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
    users: state.users,
    challenge,
    scorecards: state.scorecards,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {};
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ChallengeLeaderboard);
