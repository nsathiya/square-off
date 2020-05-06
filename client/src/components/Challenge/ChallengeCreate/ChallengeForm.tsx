import * as React from 'react';

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

export default function ChallengeForm (props: any) {
  const classes = useStyles();
  const exercise: Exercise = props.exercise;
  const metricsForExercise = MetricsForExercise[exercise];
  return (
    <form className={classes.form} noValidate={true} onSubmit={props.handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        id="challengeName"
        label="Challenge Name"
        name="name"
        autoFocus={true}
        onChange={props.handleChange}
        value={props.state.values.name}
      />
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="metric">Metric For</InputLabel>
        <Select
            native={true}
            id="metric"
            label="Metric"
            name="metric"
            value={props.state.values.metric}
            variant="outlined"
            required={true}
            fullWidth={true}
            onChange={props.handleChange}
            inputProps={{
              name: 'metric',
              id: 'metric',
            }}
        >
        {
          metricsForExercise.map((metric: ExerciseMetric) => (
            <option value={metric}>{metric}</option>
          ))
        }
        </Select>
      </FormControl>
      <TextField
        id="startTime"
        name="startTime"
        label="Start Time"
        type="datetime-local"
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        defaultValue="2017-05-24T10:30"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={props.handleChange}
        value={props.state.values.startTime}
      />
      <TextField
        id="endTime"
        name="endTime"
        label="End Time"
        type="datetime-local"
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        defaultValue="2017-05-18T10:30"
        InputLabelProps={{
          shrink: true,
        }}
        onChange={props.handleChange}
        value={props.state.values.endTime}
      />
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Next
      </Button>
    </form>
  );
}
