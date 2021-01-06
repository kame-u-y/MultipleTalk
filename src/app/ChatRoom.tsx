import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Link, Redirect, Route, RouteComponentProps } from 'react-router-dom';
import Peer, { RoomStream, MeshRoom } from 'skyway-js';
import { ResonanceAudio } from 'resonance-audio';
import { UserOffset } from './interfaces/UserOffset';
import { RemoteInfo } from './interfaces/RemoteInfo';
import { MySelf, RemoteUser } from './components/User';
import { DefaultRemoteInfo, remoteReducer } from './functions/remoteReducer';
import * as H from 'history';
import {
  Box,
  Button,
  createStyles,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core';
import { useCookies } from 'react-cookie';
import { MainTalk, SubTalk } from './components/TalkPaper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      color: 'dimgray',
    },
    root: {
      flexGrow: 1,
      height: '100%',
    },
  })
);

interface Props extends RouteComponentProps<{}> {
  location: H.Location<{
    roomName: String;
    displayName: String;
  }>;
}

const ChatRoom = (props: Props) => {
  const [isSetState, setIsSetState] = useState<Boolean>(false);
  const [cookies, setCookie] = useCookies(['roomName', 'displayName']);
  const classes = useStyles();

  const peer: Peer = useMemo(
    () =>
      new Peer({
        key: 'fd3c4153-7356-46f2-a4d0-8aab4716e77c',
        debug: 3,
      }),
    []
  );
  const [localStream, setLocalStream] = useState<MediaStream>(null);
  const [remotes, remoteDispatch] = useReducer(remoteReducer, []);

  const [room, setRoom] = useState<MeshRoom>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext>(null);
  const [resonanceAudio, setResonanceAudio] = useState<ResonanceAudio>(null);

  const [isBreakTime, setIsBreakTime] = useState<Boolean>(false);

  // resonance audioに関する初期化
  const initAudio = () => {
    const newAudioCtx = new AudioContext();
    const newResonanceAudio = new ResonanceAudio(newAudioCtx);
    newResonanceAudio.output.connect(newAudioCtx.destination);

    setAudioCtx(newAudioCtx);
    setResonanceAudio(newResonanceAudio);
  };

  useEffect(() => {
    initAudio();
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setLocalStream(stream);
        setIsSetState(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ボタン押すなりなんなり
  const joinTrigger = () => {
    if (!audioCtx) {
      alert('まず初期化してくれ');
      return;
    }
    if (!peer.open) return;
    const roomID = document.querySelector<HTMLInputElement>('#room-id').value;
    const room: MeshRoom = peer.joinRoom(roomID, {
      mode: 'mesh',
      stream: localStream,
    });
    setRoom(room);

    room.once('open', () => {
      console.log('=== You joined ===');
    });

    room.on('peerJoin', (peerID) => {
      console.log(`=== ${peerID} joined ===`);
    });

    room.on('stream', async (stream: RoomStream) => {
      //// resonance audioのノードの追加
      const audioSrc = resonanceAudio.createSource();
      audioSrc.setPosition(-0.707, 0, -0.707);
      const streamSrc = audioCtx.createMediaStreamSource(stream);
      streamSrc.connect(audioSrc.input);

      ////
      remoteDispatch({
        type: 'add',
        remote: {
          peerID: stream.peerId,
          stream: stream,
          imgSrc: '',
          userOffset: {
            x: 0,
            z: 0,
          },
          audioSrc: audioSrc,
        },
      });
    });

    room.on('data', ({ data, src }) => {
      const newAudioSrc = remotes.find((remo: RemoteInfo) => {
        return remo.peerID === src;
      }).audioSrc;
      newAudioSrc.setPosition(data.x / 100.0, 0, data.z / 100.0);

      remoteDispatch({
        type: 'updateUserOffset',
        remote: {
          ...DefaultRemoteInfo,
          peerID: src,
          userOffset: {
            x: data.x,
            z: data.z,
          },
          audioSrc: newAudioSrc,
        },
      });
    });

    room.on('peerLeave', (peerID) => {
      const remoteVideo: HTMLVideoElement = document.querySelector(
        `[data-peer-id=${peerID}`
      );
      // remoteVideo.current.srcObject.getTracks().forEach((track) => track.stop());
      remoteVideo.srcObject = null;
      remoteVideo.remove();
      // remotes = remotes.filter((v) => v.peerID !== peerID);
      console.log(`=== ${peerID} left ===`);
    });

    room.once('close', () => {
      console.log('=== You left ===');
      // remotes = [];
    });
  };

  const handleLeave = () => {
    setCookie('roomName', '');
    setCookie('displayName', '');
  };

  const leftStyle = {
    height: '33.3%',
  };

  if (!isSetState) {
    return <></>;
  } else if (!props.location.state) {
    return <Redirect to="/" />;
  } else {
    return (
      <Grid container className={classes.root}>
        <Grid container xs={6} direction="column">
          <Grid item style={leftStyle}>
            <SubTalk />
          </Grid>
          <Grid item style={leftStyle}>
            <SubTalk />
          </Grid>
          <Grid item style={leftStyle}>
            <SubTalk />
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <MainTalk />
        </Grid>
        {/* <Link to="/" onClick={() => handleLeave()}>
          LeaveRoom
        </Link> */}
      </Grid>
    );
  }
};

export default ChatRoom;
