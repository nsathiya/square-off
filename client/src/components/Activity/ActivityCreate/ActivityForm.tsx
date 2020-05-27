import * as React from 'react';
import * as moment from 'moment';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import { Exercise, ExerciseMetric } from '../../../infra/types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formControl: {
    minWidth: 120,
    marginTop: theme.spacing(3),
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type MetricsMap = { [key in Exercise]: Array<ExerciseMetric> };

const MetricsForExercise: MetricsMap = {
  [Exercise.CYCLE]: [ExerciseMetric.DISTANCE, ExerciseMetric.TIME],
  [Exercise.RUN]: [ExerciseMetric.DISTANCE, ExerciseMetric.TIME],
  [Exercise.CROSSFIT]: [ExerciseMetric.TIME],
  [Exercise.INDOOR_CYCLE]: [ExerciseMetric.DISTANCE, ExerciseMetric.TIME],
  [Exercise.INDOOR_RUN]: [ExerciseMetric.DISTANCE, ExerciseMetric.TIME],
  [Exercise.YOGA]: [ExerciseMetric.TIME],
};

const ExercisesWithDistance = Object
  .keys(MetricsForExercise)
  .filter((exercise: Exercise) => MetricsForExercise[exercise].includes(ExerciseMetric.DISTANCE));

export default function ActivityForm (props: any) {
  const classes = useStyles();
  const exercise: Exercise = props.exercise;
  const metricsForExercise = MetricsForExercise[exercise];
  if (!exercise) {
    return null;
  }

  const distanceApplicable = ExercisesWithDistance.includes(props.exercise);
  const defaultStartTime = moment().format('YYYY-MM-DD[T]HH:mm');
  return (
    <form className={classes.form} noValidate={true} onSubmit={props.handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        id="name"
        label="Activity Name"
        name="name"
        autoFocus={true}
        onChange={props.handleChange}
        value={props.state.values.name}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        id="caloriesBurned"
        label="Calories Burned"
        name="caloriesBurned"
        onChange={props.handleChange}
        value={props.state.values.caloriesBurned}
      />
      {
        distanceApplicable
        &&
        <TextField
          id="distance"
          name="distance"
          label="Distance (in miles)"
          type="number"
          variant="outlined"
          margin="normal"
          required={true}
          fullWidth={true}
          defaultValue="3.5"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={props.handleChange}
          value={props.state.values.distance}
        />
      }
      <TextField
        id="time"
        name="time"
        label="Duration (in minutes)"
        type="number"
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        defaultValue={25}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={props.handleChange}
        value={props.state.values.time}
      />
      <TextField
        id="startTime"
        name="startTime"
        label="Start Time"
        type="datetime-local"
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        defaultValue={defaultStartTime}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={props.handleChange}
        value={props.state.values.startTime}
      />
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Create
      </Button>
    </form>
  );
}
