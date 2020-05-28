import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SelectExercise from './SelectExercise';
import ChallengeForm from './ChallengeForm';
import SelectParticipants from './SelectParticipants';
import SquareForm from '../../SquareForm';
import Grid from '@material-ui/core/Grid';

import { withMain } from '../../Main/withMain';
import { UserState } from '../../../infra/reducers/userReducer';
import { FriendsState } from '../../../infra/reducers/friendsReducer';
import { ChallengesState } from '../../../infra/reducers/challengesReducer';
import { Challenge } from '../../../infra/types';
import { IStoreState } from '../../../infra/store';
import { extractFriends } from '../../../infra/store/extractors';

import { createChallenge as createChallengeApi } from '../../../infra/actions/authenticationActions';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

}));

type StateProps = {
  readonly user?: UserState;
  readonly friends: FriendsState;
  readonly challenges: ChallengesState;
};

type DispatchProps = {
  createChallenge: (challenge: Challenge) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {};

type Props = StateProps & DispatchProps & OwnProps;

enum CreationActions {
  SELECT_EXERCISE = 'SELECT_EXERCISE',
  CHALLENGE_DETAILS = 'CHALLENGE_DETAILS',
  SELECT_FRIENDS = 'SELECT_FRIENDS',
}

const Actions = [
  CreationActions.SELECT_EXERCISE,
  CreationActions.CHALLENGE_DETAILS,
  CreationActions.SELECT_FRIENDS,
];

const ChallengeCreator = ({ user, createChallenge, friends, challenges }: Props) => {
    const classes = useStyles();
    const history = useHistory();

    const [currentActionIndex, setActionIndex] = useState(0);
    const [exercise, setExercise] = useState('');
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [participants, setParticipants] = useState<Array<string>>([]);

    const nextAction = () => {
      // If at the end action, create challenge
      if (currentActionIndex === Actions.length - 1) {
        throw new Error('Last action. Cannot go to first action');
      } else {
        setActionIndex(currentActionIndex + 1);
      }
    };
    const prevAction = () => {
      // If at the end action, throw error?
      if (currentActionIndex === 0) {
        throw new Error('First action. Cannot go to previous action');
      } else {
        setActionIndex(currentActionIndex - 1);
      }
    };
    const onChallengeDetailSubmit = (challengeDetails: Challenge) => {
      setChallenge(challengeDetails);
      nextAction();
    };
    const createChallengeOnSubmit = (formData: any) => {
      const challengeToCreate = Object.assign(
        {
          exercise,
          participants: [user!.id, ...formData.participants]
        },
        challenge
      );
      console.log('creating challenge', challengeToCreate);
      createChallenge(challengeToCreate);
      history.push('/challenges');
    };
    const currentAction = Actions[currentActionIndex];
    let view;
    switch (currentAction) {
      case CreationActions.SELECT_EXERCISE:
        view = <SelectExercise setExercise={setExercise} nextAction={nextAction} />;
        break;
      case CreationActions.CHALLENGE_DETAILS:
        view = (
          <Grid>
            <SquareForm
              fieldNames={['name', 'metric', 'startTime', 'endTime']}
              onSubmit={onChallengeDetailSubmit}
            >
              <ChallengeForm exercise={exercise} />
            </SquareForm>
          </Grid>
        );
        break;
      case CreationActions.SELECT_FRIENDS:
        view = (
          <Grid>
            <SquareForm
              fieldNames={['participants']}
              onSubmit={createChallengeOnSubmit}
            >
              <SelectParticipants friends={friends} />
            </SquareForm>
          </Grid>
        );
        break;
      default:
        view = <div/>;
    }
    return (
      <Grid container={true} spacing={3}>
        <Grid container={true} direction={'row'} justify={'center'} >
          {view}
        </Grid>
      </Grid>
    );
};

function mapStateToProps (state: IStoreState): StateProps {
  return {
    user: state.user,
    friends: extractFriends(state),
    challenges: state.challenges,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    createChallenge: (challenge: Challenge): any => { dispatch(createChallengeApi(challenge)); }
  };
}

const component = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ChallengeCreator);
export default withMain(component);
