import * as React from 'react';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { UserState } from '../../../infra/reducers/userReducer';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  formControl: {
    minWidth: 120,
    maxWidth: 420,
    marginTop: theme.spacing(3),
    width: '100%',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SelectParticipants (props: any) {
  const classes = useStyles();
  const friends = Object.values(props.friends);

  const participants = props.state.values.participants || [];
  return (
    <form className={classes.form} noValidate={true} onSubmit={props.handleSubmit}>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="participants">Select Participants From Friends</InputLabel>
        <Select
            id="participants"
            label="Participants"
            name="participants"
            multiple={true}
            value={participants}
            variant="outlined"
            required={true}
            fullWidth={true}
            onChange={(e) => props.handleChange(e as any, e.target.name, e.target.value)}
            input={<Input />}
            MenuProps={MenuProps}
            renderValue={(selected: any) => {
              const withNames = selected.map((id: string) => {
                return `${props.friends[id].firstName} ${props.friends[id].lastName}`;
              });
              return withNames.join(', ');
            }}
        >
        {
          friends.map((friend: UserState) => (
            <MenuItem key={friend.id!} value={friend.id!}>
              <Checkbox checked={participants.indexOf(friend.id!) > -1} />
              <ListItemText primary={`${friend.firstName} ${friend.lastName}`} />
            </MenuItem>
          ))
        }
        </Select>
      </FormControl>
      <Button
        type="submit"
        fullWidth={true}
        variant="contained"
        color="primary"
        className={classes.submit}
      >
      Create Challenge
      </Button>
    </form>
  );
}
