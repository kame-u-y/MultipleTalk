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
import commentReducer from '../reducers/commentReducer';
import TalkPaperProps from '../interfaces/TalkPaperProps';
import useTalkPaperStyles from '../styles/talkPaperStyles';

const TalkPaper = (props: TalkPaperProps) => {
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
    inputRef.current.querySelector('textarea').value = '';
    setInputComment('');
  };

  return (
    <Paper className={classes.talkPaper} variant="outlined">
      <Paper
        elevation={0}
        square
        style={{
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
            multiline
            rowsMax={5}
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
            onClick={() => handleSubmit()}
          >
            ＞
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export const MainTalk = () => {
  return <TalkPaper talkNum={1} />;
};

export const SubTalk = (props: TalkPaperProps) => {
  return <TalkPaper talkNum={props.talkNum} />;
};
