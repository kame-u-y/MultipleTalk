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
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      color: 'dimgray',
    },
    root: {
      flexGrow: 1,
      // height: '100vh',
      height: '100%',
    },
    paper: {
      padding: theme.spacing(2),
      margin: 'auto',
      maxWidth: '100%',
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
    height: '33%',
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
            <Paper className={classes.paper}>
              <h1 className={classes.title}>Spacial Sound Chat</h1>
            </Paper>
          </Grid>
          <Grid item style={leftStyle}>
            <Paper className={classes.paper}>
              <h1 className={classes.title}>Spacial Sound Chat</h1>
            </Paper>
          </Grid>
          <Grid item style={leftStyle}>
            <Paper className={classes.paper}>
              <h1 className={classes.title}>Spacial Sound Chat</h1>
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <h1 className={classes.title}>Spacial Sound Chat</h1>
          </Paper>
        </Grid>
        {/* <Link to="/" onClick={() => handleLeave()}>
          LeaveRoom
        </Link> */}
      </Grid>

      // <div>
      //   <h1 className={classes.title}>Spacial Sound Chat</h1>
      //   <Link to="/" onClick={() => handleLeave()}>
      //     Leave Room
      //   </Link>
      //   <div id="remote-users">
      //     {remotes.map((rem) => (
      //       <RemoteUser
      //         key={rem.peerID}
      //         imgSrc={rem.imgSrc}
      //         stream={rem.stream}
      //         userOffset={rem.userOffset}
      //       />
      //     ))}
      //   </div>
      //   <p>Room Name: {props.location.state.roomName}</p>
      //   <p>Display Name: {props.location.state.displayName}</p>
      //   {/* <p>適当に部屋の名前を決めて集まれる</p>
      // <p>（例：Init Audio Context → "a"と入力 → Join Room）</p> */}
      //   {/* <button onClick={initTrigger}>Init Audio Context</button> */}
      //   {/* <input type="text" id="room-id" />
      // <button onClick={joinTrigger}>Join Room</button> */}
      //   {/* <button onClick={videoMute}>video mute</button> */}
      //   {/* <Link to="/test">test</Link> */}
      //   {localStream === null ? (
      //     <p>Loading...</p>
      //   ) : (
      //     <MySelf
      //       imgSrc="https://pbs.twimg.com/profile_images/1250664544159985670/KVnA6vJu_400x400.jpg"
      //       stream={localStream}
      //       getXZ={({ x, z }: UserOffset) => {
      //         if (x === null || z === null) return;
      //         if (!room) return;
      //         if (!isBreakTime) {
      //           room.send({ x: x, z: z });

      //           const newAudioScene = resonanceAudio;
      //           newAudioScene.setListenerPosition(x / 100.0, 0, z / 100.0);
      //           // console.log(newAudioScene);
      //           setResonanceAudio(newAudioScene);
      //           setIsBreakTime(true);
      //           setTimeout(() => setIsBreakTime(false), 100);
      //         }
      //       }}
      //     />
      //   )}
      //   {/* <div className="speaker">aaa
      //   <img src="./data/speaker.png"></img>
      // </div> */}
      // </div>
    );
  }
};

export default ChatRoom;
