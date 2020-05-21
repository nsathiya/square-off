import * as React from 'react';
import { useState, SetStateAction } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import ButtonBase from '@material-ui/core/ButtonBase';

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
  hover: {
    '&:hover': {
      backgroundColor: 'rgba(103, 78, 255, 0.12)',
      color: 'FFFFFF'
    }
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
    marginRight: 8,
    marginLeft: 8,
  },
  gridListTile: {
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
  },
  gridListTileBar: {
    color: '#674EFF',
    backgroundColor: 'transparent',
  }
}));

type StateProps = {};

type DispatchProps = {};

type OwnProps = {
  onSelect: any,
};

type Props = StateProps & DispatchProps & OwnProps;

const SelectExercise = ({ onSelect }: Props) => {
    const classes = useStyles();
    const numberOfExercises = Object.values(Exercise) ? Object.values(Exercise).length : 0;
    const [exerciseChosen, setExerciseChosen] = useState(Exercise.CYCLE);
    const exercises = Object.values(Exercise).map((exercise: Exercise) => {
      const clicked = exercise === exerciseChosen;
      return (
        <GridListTile
          key={exercise}
          classes={{
            tile: classes.gridListTile,
          }}
        >
          <ButtonBase
            classes={{
              root: classes.hover
            }}
            style={
              Object.assign(
                { width: '100%', height: '100%'},
                clicked && { backgroundColor: 'rgba(103, 78, 255, 0.12)'}
              )
            }
            onClick={() => {
              setExerciseChosen(exercise);
              onSelect(exercise);
            }}
          >
            <GridListTileBar
              classes={{
                title: classes.gridListTileBar
              }}
              className={classes.gridListTileBar}
              title={exercise}
            />
          </ButtonBase>
        </GridListTile>
     );
    });
    return (
      <div className={classes.root}>
        <GridList
          cellHeight={100}
          cols={numberOfExercises}
          spacing={4}
          className={classes.gridList}
        >
          {exercises}
        </GridList>
      </div>
    );
};

function mapStateToProps (state: IStoreState): StateProps {
  return {};
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {};
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(SelectExercise);
