import React, {
  useState,
  useEffect,
  useReducer,
  useMemo,
  FC,
  createElement,
} from 'react';
import { Link, Redirect, Route, RouteComponentProps } from 'react-router-dom';
import Peer, { RoomStream, MeshRoom } from 'skyway-js';
import { ResonanceAudio } from 'resonance-audio';
import { UserOffset } from './interfaces/UserOffset';
import { RemoteInfo } from './interfaces/RemoteInfo';
import { MySelf, RemoteUser } from './components/User';
import { DefaultRemoteInfo, remoteReducer } from './functions/remoteReducer';
import { Location } from 'history';
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
      // flexGrow: 1,
      height: '100vh',
    },
  })
);

interface Props extends RouteComponentProps {
  peer: Peer;
  location: Location<{
    roomName: string;
    displayName: string;
  }>;
}

const ChatRoom = (props: Props) => {
  if (!props.location.state) {
    return <Redirect to="/" />;
  }

  const [cookies, setCookie] = useCookies(['roomName', 'displayName']);
  const classes = useStyles();

  const peer = props.peer;
  const [localStream, setLocalStream] = useState<MediaStream>(null);
  const [mainLocalStream, setMainLocalStream] = useState<MediaStream>(null);
  const [subLocalStream, setSubLocalStream] = useState<MediaStream>(null);

  const [remotes, remoteDispatch] = useReducer(remoteReducer, []);

  // const [room, setRoom] = useState<MeshRoom>(null);
  const [mainRoom, setMainRoom] = useState<MeshRoom>(null);
  const [subRoom, setSubRoom] = useState<MeshRoom>(null);

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
        video: false,
        audio: true,
      })
      .then((stream) => {
        setLocalStream(stream);
        console.warn('init mediadevice');
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!localStream) return;
    const newMainLocalStream = new MediaStream();
    newMainLocalStream.addTrack(localStream.getAudioTracks()[0]);
    setMainLocalStream(newMainLocalStream);

    const newSubLocalStream = new MediaStream();
    newSubLocalStream.addTrack(localStream.getAudioTracks()[0]);
    // newSubLocalStream
    // newSubLocalStream
    //   .getAudioTracks()
    //   .forEach((track) => (track.enabled = false));
    setSubLocalStream(newSubLocalStream);
    console.warn('init main,sub');
    console.log(localStream);
    console.log(newMainLocalStream);
    console.log(newSubLocalStream);
  }, [localStream]);

  // ボタン押すなりなんなり
  const joinTrigger = () => {
    if (!audioCtx) {
      alert('AudioContext is not initialized');
      return;
    }
    if (!peer.open) {
      alert('peer is not open');
      return;
    }

    const initRoom = (side: string): void => {
      const roomID = `${props.location.state.roomName}_${side}`;
      const room: MeshRoom = peer.joinRoom(roomID, {
        mode: 'mesh',
        stream: side === 'main' ? mainLocalStream : subLocalStream,
      });
      if (side === 'main') {
        setMainRoom(room);
      } else {
        setSubRoom(room);
      }
      console.warn('init room');
      room.once('open', () => {
        console.log('=== You joined ===');
      });

      room.on('peerJoin', (peerID) => {
        console.log(`=== ${peerID} joined ===`);
      });

      room.on('stream', async (stream: RoomStream) => {
        console.log(stream);
        console.warn(room.name);
        // resonance audioのノードの追加
        const audioSrc = resonanceAudio.createSource();
        if (room.name === `${props.location.state.roomName}_main`) {
          audioSrc.setPosition(0.7, 0, 0);
          console.warn(`main matched`);
        } else if (room.name === `${props.location.state.roomName}_sub`) {
          audioSrc.setPosition(-0.7, 0, 0);
          console.warn(`sub matched`);
        } else {
          console.error('not match roomname');
        }
        // audioSrc.setPosition(0, 0, 0);
        const streamSrc = audioCtx.createMediaStreamSource(stream);
        streamSrc.connect(audioSrc.input);

        const audioElement = document.createElement('audio');
        audioElement.srcObject = stream;
        audioElement.play();
        audioElement.muted = true;

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
        // const newAudioSrc = remotes.find((remo: RemoteInfo) => {
        //   return remo.peerID === src;
        // }).audioSrc;
        // newAudioSrc.setPosition(data.x / 100.0, 0, data.z / 100.0);
        // remoteDispatch({
        //   type: 'updateUserOffset',
        //   remote: {
        //     ...DefaultRemoteInfo,
        //     peerID: src,
        //     userOffset: {
        //       x: data.x,
        //       z: data.z,
        //     },
        //     audioSrc: newAudioSrc,
        //   },
        // });
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
    initRoom('main');
    initRoom('sub');
  };

  useEffect(() => {
    if (!mainLocalStream || !subLocalStream) return;
    joinTrigger();
  }, [mainLocalStream, subLocalStream]);

  const handleLeave = () => {
    setCookie('roomName', '');
    setCookie('displayName', '');
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Grid container direction="column">
          <Grid item>
            <SubTalk />
          </Grid>
          <Grid item>
            <SubTalk />
          </Grid>
          <Grid item>
            <SubTalk />
          </Grid>
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
};

export default ChatRoom;
