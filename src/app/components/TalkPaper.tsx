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
// import { RouteComponentProps } from 'react-router-dom';

interface TalkPaperProps {
  // isMain: boolean;
  talkNum: number;
}

// const DefaultTalkPaperProps = {
//   isMain: true,
//   talkNum: 1,
// };

const TalkPaper = (props: TalkPaperProps) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      talkPaper: {
        padding: '10px',
        height: `calc(${100.0 / props.talkNum}vh - 22px)`,
        // position: 'relative',
      },
      // mainPaper: {
      //   padding: '10px',
      //   height: 'calc(100vh - 22px)',
      //   position: 'relative',
      // },
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
      comment: {
        color: 'gray',
      },
    })
  );
  const classes = useStyles();

  const handleChange = (e: any) => {};
  return (
    <Paper
      // className={props.isMain ? classes.mainPaper : classes.subPaper}
      className={classes.talkPaper}
      variant="outlined"
    >
      <Paper
        elevation={0}
        square
        style={{
          // height: `calc(${props.isMain ? '100vh' : '33.3vh'} - 22px - 40px)`,
          height: `calc(${100 / props.talkNum}vh - 22px - 40px)`,
          overflow: 'scroll',
        }}
      >
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="flex-start"
        >
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
          <Grid item>
            <h1 className={classes.comment}>hoge</h1>
          </Grid>
        </Grid>
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

export const MainTalk = () => {
  // return <TalkPaper isMain={true} />;
  return <TalkPaper talkNum={1} />;
};

export const SubTalk = (props: { talkNum: number }) => {
  // return <TalkPaper isMain={false} talkNum={props.talkNum} />;
  return <TalkPaper talkNum={props.talkNum} />;
};
