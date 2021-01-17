import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
} from '@material-ui/core';
import React, { ChangeEvent, useReducer, useRef, useState } from 'react';
import { commentReducer } from '../reducers/commentReducer';
import { MainTalkProps, SubTalkProps } from '../interfaces/TalkPaperProps';
import { useTalkPaperStyles } from '../styles/talkPaperStyles';
import muteMic from '../images/mic_mute.png';
import unmuteMic from '../images/mic_unmute.png';

export const MainTalk = (props: MainTalkProps) => {
  const classes = useTalkPaperStyles(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputComment, setInputComment] = useState('');
  const [comments, commentDispatch] = useReducer(commentReducer, []);

  const handleChange = (e: any) => setInputComment(e.target.value);
  const handleSubmit = () => {
    if (inputComment === '') {
      console.log('comment is blank');
      return;
    }
    commentDispatch({ type: 'add', comment: inputComment });
    inputRef.current.querySelector('input').value = '';
    setInputComment('');
  };
  return (
    <Paper className={classes.talkPaper} variant="outlined">
      <Paper
        elevation={0}
        square
        style={{
          height: `calc(100vh - 22px - 40px - 116.75px - 20px)`,
          overflow: 'scroll',
        }}
      >
        <Grid container direction="column">
          {comments.map((com: string, id: number) => (
            <Grid item key={id}>
              <h1 className={classes.comment}>{com}</h1>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        // xs={12}
        className={classes.mainUnmuteGrid}
      >
        <Grid item xs={2}>
          <input
            className={classes.unmuteButton}
            type="image"
            src={props.unmuteColor ? unmuteMic : muteMic}
            onClick={(ev: any) => {
              ev.target.src = unmuteMic;
              props.unmuteHandler();
            }}
          ></input>
        </Grid>
      </Grid>
      <Grid container justify="center">
        <Grid item xs={11}>
          <TextField
            ref={inputRef}
            className={classes.textField}
            variant="outlined"
            // multiline
            // rowsMax={5}
            size="small"
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          />
        </Grid>
        <Grid className={classes.buttonGrid} item xs={1}>
          <div style={{ flex: 1 }}></div>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={(e) => {
              handleSubmit();
            }}
          >
            ＞
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export const SubTalk = (props: SubTalkProps) => {
  const classes = useTalkPaperStyles(props.talkNum);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputComment, setInputComment] = useState('');
  const [comments, commentDispatch] = useReducer(commentReducer, []);

  const handleChange = (e: any) => setInputComment(e.target.value);
  const handleSubmit = () => {
    if (inputComment === '') {
      console.log('comment is blank');
      return;
    }
    commentDispatch({ type: 'add', comment: inputComment });
    inputRef.current.querySelector('input').value = '';
    setInputComment('');
  };

  return (
    <Paper className={classes.talkPaper} variant="outlined">
      <Grid container>
        <Grid item xs={9}>
          <Paper
            elevation={0}
            square
            style={{
              height: `calc(${100 / props.talkNum}vh - 22px - 40px)`,
              overflow: 'scroll',
            }}
          >
            <Grid container direction="column">
              {comments.map((com: string, id: number) => (
                <Grid item key={id}>
                  <h1 className={classes.comment}>{com}</h1>
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Grid container justify="center">
            <Grid item xs={11}>
              <TextField
                ref={inputRef}
                className={classes.textField}
                variant="outlined"
                // multiline
                // rowsMax={5}
                size="small"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              />
            </Grid>
            <Grid className={classes.buttonGrid} item xs={1}>
              <div style={{ flex: 1 }}></div>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                onClick={(e) => {
                  handleSubmit();
                }}
              >
                ＞
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          direction="row"
          justify="center"
          alignItems="center"
          xs={3}
          container
          className={classes.subUnmuteGrid}
        >
          <Grid item>
            <input
              className={classes.unmuteButton}
              type="image"
              src={props.unmuteColor ? unmuteMic : muteMic}
              onClick={(ev: any) => {
                // ev.target.src = unmuteMic;
                props.unmuteHandler();
              }}
            ></input>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
