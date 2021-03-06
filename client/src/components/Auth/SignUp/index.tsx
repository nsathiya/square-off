import * as React from 'react';
import { useContext, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { SignUpForm } from './SignUpForm';
import SquareForm from '../../SquareForm';
import { signUp as signUpAction } from '../../../infra/actions/authenticationActions';
import { IStoreState } from '../../../infra/store';
import { UserState } from '../../../infra/reducers/userReducer';
// import { login, logout } from '../infra/store/users';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../App/index';
import * as firebase from 'firebase';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paperRight: {
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  paperLeft: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#674EFF',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface SignUpProps {
  readonly user: UserState;
  signUp: (values: {}) => (dispatch: Dispatch<any>) => Promise<void>;
}

function SignUp(props: SignUpProps) {
  const classes = useStyles();
  const Auth = useContext(AuthContext);
  const [errors, setErrors] = useState(null);

  const onSubmit = (values: { username: string, email: string, password: string}) => {
    // first_name: user.firstName,
    // last_name: user.lastName,
    // username: user.username,
    // email: user.email,
    // phone_number: user.phoneNumber,
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(response => {
        if (!response.user) {
          // TODO alert
          return;
        }
        // hack for now. We keep track of user based on username, as username is unique.
        response.user.updateProfile({ displayName: values.username });
        Auth.setLoggedIn(true);
        props.signUp(values);
      })
      .catch(e => {
        setErrors(e.message);
      });

  };
  if (Auth.isLoggedIn) {
    const history = useHistory();
    history.push('/');
  }

  return (
    <Box width="100%" height="100%">
    <Container component="main" maxWidth={false}>
      <CssBaseline />
      <Grid container={true} direction="row">
        <Grid item={true} xs={4}>
          <Box className={classes.paperLeft} height="100%" />
        </Grid>
        <Grid item={true} xs={8}>
          <Box className={classes.paperRight} height="100%">
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Create an Account
            </Typography>
            {
              errors
              &&
              <Typography variant="body2" color="error">
                {errors}
              </Typography>
            }
            <SquareForm
              fieldNames={['firstName', 'lastName', 'username', 'email', 'password']}
              onSubmit={onSubmit}
            >
              <SignUpForm />
            </SquareForm>
          </Box>
        </Grid>
      </Grid>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
    </Box>
  );
}

function mapStateToProps (state: IStoreState) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    signUp: (value: {}) => { dispatch(signUpAction(value)); }
  };
}

export default connect<{}, {}, SignUpProps>(mapStateToProps, mapDispatchToProps)(SignUp);
