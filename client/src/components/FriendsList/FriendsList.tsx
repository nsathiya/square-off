import * as React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { Dispatch, Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { ListItemText, ListItem, List, ListItemIcon } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

import { IStoreState } from '../../infra/store';
import { UserState } from '../../infra/reducers/userReducer';
import { FriendsState } from '../../infra/reducers/friendsReducer';
import { getFriends } from '../../infra/actions/authenticationActions';

const useStyles = (theme: Theme) => {
  const style: StyleRules = {
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    fixedHeight: {
      height: 400,
    },
    friendsList: {
      display: 'flex',
      overflow: 'auto',
      flexDirection: 'column',
    },
    searchItem : {
      color: '#674EFF',
    }
  };
  return style;
};

type StateProps = {
  readonly user?: UserState;
  readonly friends: FriendsState;
};

type DispatchProps = {
  getAllFriends: (userId: string) => (dispatch: Dispatch<any>) => Promise<void>;
};

type OwnProps = {
  classes?: any;
};

type Props = StateProps & DispatchProps & OwnProps;

interface FriendsListState {
}

class FriendsList extends React.Component<Props, FriendsListState> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { getAllFriends, user} = this.props;
    if (user && user.id) {
      getAllFriends(user.id);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // just a reference check is enough
    if (this.props.friends !== prevProps.friends) {
      this.renderFriends();
    }
    const { user: thisUser, getAllFriends } = this.props;
    const { user: prevUser } = prevProps;

    if (thisUser &&
        thisUser.id &&
        thisUser.id !== prevUser!.id) {
      getAllFriends(thisUser.id);
    }
  }

  renderFriends = () => {
    const { classes, friends } = this.props;
    if (Object.keys(friends).length = 0) {
      return (
        <Typography variant="body1" gutterBottom={true}>
          Aww, you have no friends. Add friends or invite them to Square Off!
        </Typography>
      );
    }
    const users = Object.keys(friends).map((friendId: string, idx) => {
      const friend = friends[friendId];
      const name = `${friend.firstName} ${friend.lastName} [${friend.username}]`;
      return (
        <ListItem
          key={idx}
          button={true}
        >
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          <ListItemText
            primary={
            <Typography variant="body2" className={this.props.classes.searchItem}>
              {name}
            </Typography>}
          />
          <Typography variant="body2" align="right" gutterBottom={false}>
            pending
          </Typography>
        </ListItem>
      );
    });
    return (
      <List component="nav" className={classes.friendsList} aria-label="contacts">
        {users}
      </List>
    );
  }

  render() {
    /*
    TODO for search component
        onRequestSearch={this.onSearch}
    */
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const friends = this.renderFriends();
    return (
      <Paper className={fixedHeightPaper}>
        <Typography variant="h5" gutterBottom={true}>
          My Friends
        </Typography>
        {friends}
      </Paper>
    );
  }
}

function mapStateToProps (state: IStoreState): StateProps {
  return {
    user: state.user,
    friends: state.friends
  };
}

function mapDispatchToProps(dispatch: ThunkDispatch<{}, void, Action>): DispatchProps {
  return {
    getAllFriends: (userId: string): any => {
      return dispatch(getFriends(userId));
    },
  };
}
const component = withStyles(useStyles)(FriendsList);
export default connect<StateProps, DispatchProps, OwnProps>(mapStateToProps, mapDispatchToProps)(component);
