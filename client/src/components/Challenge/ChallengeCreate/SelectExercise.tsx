import * as React from 'react';
import { useState, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import ButtonBase from '@material-ui/core/ButtonBase';

import { UserState } from '../../../infra/reducers/userReducer';
import { FriendsState } from '../../../infra/reducers/friendsReducer';
import { ChallengesState } from '../../../infra/reducers/challengesReducer';
import { Exercise } from '../../../infra/types';
import { IStoreState } from '../../../infra/store';

import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  cardAction: {
    display: 'block',
  },
  title: {

  },
  root: {
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    // overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  gridList: {
    display: 'flex',
    flexGrow: 1,
    height: 450,
    marginRight: 8,
    marginLeft: 8,
  },
  gridListTile: {
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    width: 240,
  },
  gridListTileBar: {
    color: '#674EFF',
    backgroundColor: theme.palette.background.paper,
  }
}));

type StateProps = {
  readonly user?: UserState;
  readonly friends: FriendsState;
  readonly challenges: ChallengesState;
};

type DispatchProps = {};

type OwnProps = {
  setExercise: any,
  nextAction: any,
};

type Props = StateProps & DispatchProps & OwnProps;

const SelectExercise = ({ setExercise, nextAction }: Props) => {
    const classes = useStyles();

    const exercises = Object.values(Exercise).map((exercise: Exercise) => {
      return (
        <GridListTile
          key={exercise}
          classes={{
            tile: classes.gridListTile
          }}
        >
          <ButtonBase
            style={{
              width: 240,
              height: '100%',
            }}
            onClick={() => {
              setExercise(exercise);
              nextAction();
            }}
          >
            <GridListTileBar
              classes={{
                title: classes.gridListTileBar
              }}
              className={classes.gridListTileBar}
              title={exercise}
              subtitle={<span>{'test'}</span>}
            />
          </ButtonBase>
        </GridListTile>
     );
    });
    return (
      <div className={classes.root}>
        <GridList
          cellHeight={120}
          cols={3}
          spacing={16}
          className={classes.gridList}
        >
          <GridListTile key="Select Exercise" cols={3} style={{ height: 'auto' }}>
            <ListSubheader component="div">Select Exercise</ListSubheader>
          </GridListTile>
          {exercises}
        </GridList>
      </div>
    );
};

function mapStateToProps (state: IStoreState): StateProps {
  return {
    friends: state.friends,
    challenges: state.challenges,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {};
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(SelectExercise);
