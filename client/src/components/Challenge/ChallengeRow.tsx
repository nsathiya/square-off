import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import { Challenge } from '../../infra/types';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

type StateProps = {};

type DispatchProps = {};

type OwnProps = {
  key: string;
  challenge: Challenge;
};

type Props = StateProps & DispatchProps & OwnProps;

export default function ChallengeRow({ key, challenge }: Props) {
  const classes = useStyles();
  const history = useHistory();
  // TODO
  const handleToggle = (id?: string) => { return; };
  return (
    <ListItem key={key} button={true} onClick={() => history.push(`/challenges/${challenge.id}`)}>
      <Grid
        container={true}
        direction={'column'}
        justify={'flex-start'}
      >
        <ListItemText primary={challenge.name} style={{ color: '#674EFF' }} />
        <ListItemText>
          {challenge.exercise} | {challenge.startTime} | {challenge.endTime} | Measured in {challenge.metric}
        </ListItemText>
        <ListItemText>
          {challenge.participants}
        </ListItemText>
      </Grid>
    </ListItem>
  );
}
