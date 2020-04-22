import * as React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
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

export const SignUpForm = (props: any) => {
  const classes = useStyles();
  return (
    <form className={classes.form} noValidate={true} onSubmit={props.handleSubmit}>
      <Grid container={true} spacing={2}>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            autoComplete="fname"
            name="firstName"
            variant="outlined"
            required={true}
            fullWidth={true}
            id="firstName"
            label="First Name"
            autoFocus={true}
            onChange={props.handleChange}
            value={props.state.values.firstName}
          />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <TextField
            variant="outlined"
            required={true}
            fullWidth={true}
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="lname"
            onChange={props.handleChange}
            value={props.state.values.lastName}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            variant="outlined"
            required={true}
            fullWidth={true}
            id="username"
            label="Username"
            name="username"
            onChange={props.handleChange}
            value={props.state.values.username}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            variant="outlined"
            required={true}
            fullWidth={true}
            id="email"
            label="Email Address"
            name="email"
            onChange={props.handleChange}
            value={props.state.values.email}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <TextField
            variant="outlined"
            required={true}
            fullWidth={true}
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={props.handleChange}
            value={props.state.values.password}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        Sign Up
      </Button>
      <Grid container={true} justify="flex-end">
        <Grid item={true}>
          <Link href="#" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </form>
  );
};
