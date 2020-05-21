import * as React from 'react';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SquareForm from '../../SquareForm';
import SelectExercise from './SelectExercise';
import ActivityForm from './ActivityForm';
import Grid from '@material-ui/core/Grid';

import { withMain } from '../../Main/withMain';
import { UserState } from '../../../infra/reducers/userReducer';
import { Activity, Exercise } from '../../../infra/types';
import { IStoreState } from '../../../infra/store';

import { createActivity as createActivityApi } from '../../../infra/actions/authenticationActions';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';

const DEFAULT_EXERCISE = Exercise.CYCLE;

const useStyles = makeStyles((theme) => ({

}));

type StateProps = {
  readonly user: UserState;
};

type DispatchProps = {
  createActivity: (activity: Activity) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {};

type Props = StateProps & DispatchProps & OwnProps;

const ActivityCreator = ({ user, createActivity }: Props) => {
    const classes = useStyles();
    const history = useHistory();

    const [exercise, setExercise] = useState(DEFAULT_EXERCISE);

    const onActivitySelection = (exerciseType: Exercise) => setExercise(exerciseType);
    const createActivityOnSubmit = (formData: any) => {
      const activityToCreate = { exercise, ...formData, userId: user.id };
      console.log('creating activity', activityToCreate);
      createActivity(activityToCreate);
      history.push('/activities');
    };
    return (
      <Grid container={true} spacing={3}>
        <Grid container={true} direction={'row'} justify={'center'} >
          <SelectExercise onSelect={onActivitySelection} />
        </Grid>
        <Grid container={true} direction={'row'} justify={'center'} >
          <Grid item={true} sm={6}>
            <SquareForm onSubmit={createActivityOnSubmit}>
              <ActivityForm exercise={exercise} />
            </SquareForm>
          </Grid>
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
    createActivity: (activity: Activity): any => { dispatch(createActivityApi(activity)); }
  };
}

const component = connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(ActivityCreator);
export default withMain(component);
