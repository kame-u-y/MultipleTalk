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
      padding: '3%',
      height: '88%',
      display: 'flex',
      flexFlow: 'column',
    },
    mainPaper: {
      padding: '3%',
      height: '96%',
      display: 'flex',
      flexFlow: 'column',
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
      marginLeft: '10px',
      minWidth: '55px',
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
      {/* <div> */}
      <div style={{ flex: 1 }}>
        <h1>hoge</h1>
      </div>
      <Grid container>
        {/* <Box> */}
        <Grid item xs={11}>
          <TextField
            className={classes.textfield}
            id="room-name"
            variant="outlined"
            // helperText="hoge"
            multiline
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
      {/* </div> */}
    </Paper>
  );
};

export const MainTalk: React.FC = () => {
  return <TalkPaper isMain={true} />;
};

export const SubTalk: React.FC = () => {
  return <TalkPaper isMain={false} />;
};
