import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      color: 'dimgray',
    },
    root: {
      flexGrow: 1,
      height: '100vh',
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: 400,
    },
    textfield: {
      width: '100%',
    },
    button: {
      float: 'right',
    },
  })
);

const Home: React.FC = (props) => {
  const classes = useStyles();
  const [cookies, setCookie] = useCookies(['roomName', 'displayName']);
  const history = useHistory();
  const [roomName, setRoomName] = useState('');
  const [roomNameError, setRoomNameError] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState(false);

  useEffect(() => {
    cookies.roomName !== '' && setRoomName(cookies.roomName);
    cookies.displayName !== '' && setDisplayName(cookies.displayName);
  }, []);

  const onChangeRoomName = (e: any) => setRoomName(e.target.value);
  const onChangeDisplayName = (e: any) => setDisplayName(e.target.value);
  const onClickJoin = () => {
    if (roomName === '' || displayName === '') {
      setRoomNameError(roomName === '' ? true : false);
      setDisplayNameError(displayName === '' ? true : false);
      return;
    }
    setCookie('roomName', roomName);
    setCookie('displayName', displayName);

    history.push({
      pathname: '/chatroom',
      state: { roomName: roomName, displayName: displayName },
    });
  };
  return (
    <Grid container className={classes.root} alignItems="center">
      <Paper className={classes.paper}>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1 className={classes.title}>Multiple Talk</h1>
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={roomName === '' && roomNameError ? true : false}
                className={classes.textfield}
                id="room-name"
                label="Room Name"
                variant="outlined"
                defaultValue={cookies.roomName}
                onChange={(e) => onChangeRoomName(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={displayName === '' && displayNameError ? true : false}
                className={classes.textfield}
                id="display-name"
                label="Display Name"
                variant="outlined"
                defaultValue={cookies.displayName}
                onChange={(e) => onChangeDisplayName(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
                // component={Link}
                // to={{
                //   pathname: '/chatroom',
                //   state: { roomName: roomName, displayName: displayName },
                // }}
                onClick={() => onClickJoin()}
              >
                Join Room
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default Home;
