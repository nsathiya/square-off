import * as React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const LogInForm = (props: any) => {
  const classes = useStyles();
  return (
    <form className={classes.form} noValidate={true} onSubmit={props.handleSubmit}>
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        id="username"
        label="Username"
        name="username"
        autoFocus={true}
        onChange={props.handleChange}
        value={props.state.values.username}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required={true}
        fullWidth={true}
        name="password"
        label="Password"
        type="password"
        id="password"
        onChange={props.handleChange}
        value={props.state.values.password}
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="Remember me"
      />
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Log In
      </Button>
      <Grid container={true}>
        <Grid item={true} xs={true}>
          <Link href="#" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item={true}>
          <Link href="#" variant="body2">
            {`Don't have an account? Sign Up`}
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};
