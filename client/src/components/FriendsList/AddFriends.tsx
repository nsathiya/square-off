import * as React from 'react';
import clsx from 'clsx';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { withStyles, StyleRules } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import SearchBar from 'material-ui-search-bar';
import { ListItemText, ListItem, List, ListItemIcon } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { IStoreState } from '../../infra/store';
import { UserState } from '../../infra/reducers/userReducer';
import { UsersState } from '../../infra/reducers/usersReducer';
import { getAllUsers, createFriend } from '../../infra/actions/authenticationActions';

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
    searchList: {
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

interface AddFriendsProps {
  readonly user?: UserState;
  readonly users?: UsersState;
  classes?: any;
  getAllUsers?: () => (dispatch: Dispatch<any>) => Promise<void>;
  createFriend?: (userId: string, userIdForFriend: string) => (dispatch: Dispatch<any>) => Promise<void>;
}
interface AddFriendsState {
  query: string;
  usersMatched: UserState[];
  openCreateFriendDialog: boolean;
  chosenUserForFriend: UserState | null;
}

class AddFriends extends React.Component<AddFriendsProps, AddFriendsState> {
  constructor(props: any) {
    super(props);

    this.onSearch = this.onSearch.bind(this);

    this.state = {
      query: '',
      usersMatched: [],
      openCreateFriendDialog: false,
      chosenUserForFriend: null
    };
    props.getAllUsers();
  }

  onSearch(query: string) {
    const usersMatched = this.props.users!.filter(user => {
      let searchSpace: string = '';
      if (user.firstName) {
        searchSpace += `${user.firstName.toLowerCase()} `;
      }
      if (user.lastName) {
        searchSpace += `${user.lastName.toLowerCase()}`;
      }
      const searchKey = query.toLowerCase().trim();
      return searchSpace.match(new RegExp(searchKey, 'g'));
    });
    console.log('usersMatched', usersMatched);
    this.setState({ usersMatched, query });
  }

  createFriend = () => {
    console.log('user', this.props.user);
    console.log('friend', this.state.chosenUserForFriend);
    const userId = this.props.user!.id!;
    const friendId = this.state.chosenUserForFriend!.id!;
    this.props.createFriend!(userId, friendId);
    this.closeCreateFriendDialog();
  }

  openCreateFriendDialog = (friend: UserState) => {
    this.setState({
      openCreateFriendDialog: true,
      chosenUserForFriend: friend
    });
  }

  closeCreateFriendDialog = () => {
    this.setState({
      openCreateFriendDialog: false,
      chosenUserForFriend: null
    });
  }

  renderUsers = () => {
    return this.state.usersMatched.map((user, idx) => {
      const name = `${user.firstName} ${user.lastName} [${user.username}]`;
      return (
        <ListItem
          key={idx}
          button={true}
          onClick={this.openCreateFriendDialog.bind(this, user)}
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
        </ListItem>
      );
    });
  }

  render() {
    /*
    TODO for search component
        onRequestSearch={this.onSearch}
    */
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    return (
      <Paper className={fixedHeightPaper}>
        <Typography variant="h5" gutterBottom={true}>
          Add Friends
        </Typography>
        <SearchBar
          value={this.state.query}
          onChange={this.onSearch}
        />
        <List component="nav" className={classes.searchList} aria-label="contacts">
        {this.renderUsers()}
        </List>
        {
          this.state.openCreateFriendDialog
          &&
          <div>
           <Dialog
             open={this.state.openCreateFriendDialog}
             onClose={this.closeCreateFriendDialog}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
           >
             <DialogTitle id="alert-dialog-title">Add Friend Confirmation</DialogTitle>
             <DialogContent>
               <DialogContentText id="alert-dialog-description">
                 Confirm to add {this.state.chosenUserForFriend!.firstName}
                  {this.state.chosenUserForFriend!.lastName} as a friend!
               </DialogContentText>
             </DialogContent>
             <DialogActions>
               <Button onClick={this.closeCreateFriendDialog} color="primary">
                 Cancel
               </Button>
               <Button onClick={this.createFriend} color="primary" autoFocus={true}>
                 Confirm
               </Button>
             </DialogActions>
           </Dialog>
         </div>
        }
      </Paper>
    );
  }
}

function mapStateToProps (state: IStoreState) {
  return {
    user: state.user,
    users: state.users
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    getAllUsers: () => {
      dispatch(getAllUsers());
    },
    createFriend: (userId: string, userIdForFriend: string) => {
      dispatch(createFriend(userId, userIdForFriend));
    },
  };
}
const component = withStyles(useStyles)(AddFriends);
export default connect<{}, {}, AddFriendsProps>(mapStateToProps, mapDispatchToProps)(component);
