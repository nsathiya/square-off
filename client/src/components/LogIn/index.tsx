import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import SquareForm from '../SquareForm';
import { LogInForm } from './LogInForm';
import { logIn as logInAction } from '../../infra/actions/authenticationActions';
import { IStoreState } from '../../infra/store';
import { UserState } from '../../infra/reducers/userReducer';
// import { login, logout } from '../infra/store/users';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { useHistory } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

type StateProps = {
  readonly user: UserState;
};

type DispatchProps = {
  logIn: (username: string, password: string) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {
  classes?: any;
};

type Props = StateProps & DispatchProps & OwnProps;

function LogIn(props: Props) {
  const classes = useStyles();
  const onSubmit = (values: { username: string, password: string }) => {
    props.logIn(values.username, values.password);
  };

  if (props.user.isAuthenticated) {
    const history = useHistory();
    history.push('/friends-list');
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <SquareForm onSubmit={onSubmit}>
          <LogInForm />
        </SquareForm>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

function mapStateToProps (state: IStoreState): StateProps {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    logIn: (username: string, password: string): any => { dispatch(logInAction(username, password)); }
  };
}

export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(LogIn);
