import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import React, { ChangeEvent, useRef, useState } from 'react';
import { MainTalkProps, SubTalkProps } from '../interfaces/TalkPaperProps';
import { useTalkPaperStyles } from '../styles/talkPaperStyles';
import muteMic from '../images/mic_mute.png';
import unmuteMic from '../images/mic_unmute.png';
import { MessageInfo } from '../interfaces/MessageInfo';

export const MainTalk = (props: MainTalkProps) => {
  const classes = useTalkPaperStyles(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputMessage, setInputMessage] = useState('');

  const handleChange = (e: any) => setInputMessage(e.target.value);
  const handleSubmit = () => {
    if (inputMessage === '') {
      console.log('message is blank');
      return;
    }
    props.sendMessageHandler(inputMessage);
    inputRef.current.querySelector('input').value = '';
    setInputMessage('');
  };
  return (
    <Paper className={classes.talkPaper} variant="outlined" square>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.mainTitleGrid}
      >
        <Grid item xs={6}>
          <h2 className={classes.title}>{props.title}</h2>
        </Grid>
      </Grid>
      <Paper
        elevation={0}
        square
        style={{
          margin: '10px 10px 0 10px',
          height: `calc(100vh - 24px - 40px - 116.75px - 20px - 50px)`,
          overflow: 'scroll',
        }}
      >
        <Grid container direction="column" spacing={1}>
          {props.messages.map((msg: MessageInfo, id: number) => (
            <Grid item key={id}>
              <p
                className={`${classes.msg} ${
                  msg.fromMyself ? classes.sentMsg : classes.recievedMsg
                }`}
              >
                {msg.msg}
              </p>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
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
      <Grid
        container
        justify="center"
        style={{
          padding: '0 10px 10px 10px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Grid item xs={10}>
          <Paper variant="outlined">
            <TextField
              ref={inputRef}
              className={classes.textField}
              variant="outlined"
              size="small"
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            />
          </Paper>
        </Grid>
        <Grid className={classes.buttonGrid} item xs={2}>
          <div style={{ flex: 1 }}></div>
          <Button
            className={classes.mainButton}
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
  const [inputMessage, setInputMessage] = useState('');

  const handleChange = (e: any) => setInputMessage(e.target.value);
  const handleSubmit = () => {
    if (inputMessage === '') {
      console.log('message is blank');
      return;
    }
    props.sendMessageHandler(inputMessage);
    inputRef.current.querySelector('input').value = '';
    setInputMessage('');
  };

  return (
    <Paper className={classes.talkPaper} variant="outlined" square>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.subTitleGrid}
      >
        <Grid item xs={6}>
          <h2 className={classes.title}>{props.title}</h2>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={9}>
          <Paper
            elevation={0}
            square
            style={{
              height: `calc(${100 / props.talkNum}vh - 24px - 40px - 50px)`,
              overflow: 'scroll',
              padding: '10px 10px 0 10px',
            }}
          >
            <Grid container direction="column" spacing={1}>
              {props.messages.map((msg: MessageInfo, id: number) => (
                <Grid item key={id}>
                  <p
                    className={`${classes.msg} ${
                      msg.fromMyself ? classes.sentMsg : classes.recievedMsg
                    }`}
                  >
                    {msg.msg}
                  </p>
                </Grid>
              ))}
            </Grid>
          </Paper>
          <Grid
            container
            justify="center"
            style={{
              padding: '0 0 10px 10px',
            }}
          >
            <Grid item xs={10}>
              <TextField
                ref={inputRef}
                className={classes.textField}
                variant="outlined"
                size="small"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
              />
            </Grid>
            <Grid className={classes.buttonGrid} item xs={2}>
              <div style={{ flex: 1 }}></div>
              <Button
                className={classes.subButton}
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
                props.unmuteHandler();
              }}
            ></input>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
