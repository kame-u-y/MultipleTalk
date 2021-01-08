import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subPaper: {
      padding: '10px',
      height: 'calc(33.3vh - 22px)',
      position: 'relative',
    },
    mainPaper: {
      padding: '10px',
      height: 'calc(100vh - 22px)',
      position: 'relative',
    },
    textfield: {
      width: '100%',
    },
    buttonGrid: {
      display: 'flex',
      flexFlow: 'column',
    },
    button: {
      float: 'right',
      marginLeft: '15px',
      minWidth: '55px',
      maxWidth: '70px',
      height: '40px',
    },
  })
);

const TalkPaper = (props: { isMain: Boolean }) => {
  const classes = useStyles();
  const handleChange = (e: any) => {};
  return (
    <Paper
      className={props.isMain ? classes.mainPaper : classes.subPaper}
      variant="outlined"
    >
      <Paper
        elevation={0}
        square
        style={{
          height: `calc(${props.isMain ? '100vh' : '33.3vh'} - 22px - 40px)`,
          backgroundColor: 'gray',
          overflow: 'scroll',
        }}
      >
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
        <h1>hoge</h1>
      </Paper>
      <Grid container justify="center">
        <Grid item xs={11}>
          <TextField
            className={classes.textfield}
            id="room-name"
            variant="outlined"
            multiline
            rowsMax={5}
            size="small"
            onChange={(e: any) => handleChange(e)}
          />
        </Grid>
        <Grid className={classes.buttonGrid} item xs={1}>
          <div style={{ flex: 1 }}></div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            ＞
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export const MainTalk: React.FC = () => {
  return <TalkPaper isMain={true} />;
};

export const SubTalk: React.FC = () => {
  return <TalkPaper isMain={false} />;
};
