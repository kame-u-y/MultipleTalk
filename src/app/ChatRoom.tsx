import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { RoomStream, MeshRoom } from 'skyway-js';
import { ResonanceAudio } from 'resonance-audio';
import { Grid } from '@material-ui/core';
import { MainTalk, SubTalk } from './components/TalkPaper';
import { ChatRoomProps } from './interfaces/Props';
import { RemoteInfo } from './interfaces/RemoteInfo';
import { remoteReducer } from './reducers/remoteReducer';
import { streamReducer } from './reducers/streamReducer';
import { useChatRoomStyles } from './styles/chatRoomStyles';

export const ChatRoom = (props: ChatRoomProps) => {
  if (!props.location.state) {
    return <Redirect to="/" />;
  }

  const [cookies, setCookie] = useCookies(['roomName', 'displayName']);
  const classes = useChatRoomStyles();

  const [audioCtx, setAudioCtx] = useState<AudioContext>(null);
  const [resonanceAudio, setResonanceAudio] = useState<ResonanceAudio>(null);

  const [localStream, setLocalStream] = useState<MediaStream>(null);
  const [mainLocalStream, setMainLocalStream] = useState<MediaStream>(null);
  // const [subLocalStream, setSubLocalStream] = useState<MediaStream>(null);
  const [subLocalStreams, subLocalStreamDispatch] = useReducer(
    streamReducer,
    []
  );

  const peer = useMemo(() => props.peer, []);
  const [mainRoom, setMainRoom] = useState<MeshRoom>(null);
  const [subRoom, setSubRoom] = useState<MeshRoom>(null);
  // const [remotes, remoteDispatch] = useReducer(remoteReducer, []);
  const [mainRemotes, mainRemoteDispatch] = useReducer(remoteReducer, []);
  const [subRemotes, subRemoteDispatch] = useReducer(remoteReducer, []);

  useEffect(() => {
    // resonanceAudioの初期化
    const newAudioCtx = new AudioContext();
    const newResonanceAudio = new ResonanceAudio(newAudioCtx);
    newResonanceAudio.output.connect(newAudioCtx.destination);
    setAudioCtx(newAudioCtx);
    setResonanceAudio(newResonanceAudio);

    // localStreamの初期化
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then((stream) => {
        setLocalStream(stream);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ボタン押すなりなんなり
  const joinTrigger = (
    joinParams:
      | { isMain: true }
      | { isMain: false; firstId: string; secondId: string }
  ) => {
    if (!audioCtx) {
      alert('AudioContext is not initialized');
      return;
    }
    if (!peer.open) {
      alert('peer is not open');
      return;
    }

    const newLocalStream = new MediaStream();
    newLocalStream.addTrack(localStream.clone().getAudioTracks()[0]);

    const attachedName =
      joinParams.isMain === true
        ? 'main'
        : `sub_${joinParams.firstId}_${joinParams.secondId}`;
    const room: MeshRoom = peer.joinRoom(
      `${props.location.state.roomName}_${attachedName}`,
      {
        mode: 'mesh',
        stream: newLocalStream,
      }
    );
    if (joinParams.isMain) {
      setMainLocalStream(newLocalStream);
    } else {
      console.log('add subLocalStream');
      subLocalStreamDispatch({
        type: 'add',
        stream: newLocalStream,
      });
    }

    room.once('open', () => {
      console.log('=== You joined ===');
      // SubRoomにお互い入るためのやりとり
      if (room.name === `${props.location.state.roomName}_main`) {
        room.send({
          msg: 'REQ_NEW_JOIN',
        });
      }
    });

    room.on('peerJoin', (peerId) => {
      console.log(`=== ${peerId} joined ===`);
    });

    room.on('stream', async (stream: RoomStream) => {
      console.log('stream event');
      // resonance audioのノードの追加
      const audioSrc = resonanceAudio.createSource();
      const isMain = room.name === `${props.location.state.roomName}_main`;
      audioSrc.setPosition(isMain ? 1 : -1, 0, 0);
      const streamSrc = audioCtx.createMediaStreamSource(stream);
      streamSrc.connect(audioSrc.input);

      // 音を出すためにはaudio elementの生成が必要
      const audioElement = document.createElement('audio');
      audioElement.srcObject = stream;
      audioElement.play();
      audioElement.muted = true;

      const newRemoteInfo = {
        peerID: stream.peerId,
        stream: stream,
        imgSrc: '',
        userOffset: {
          x: 0,
          z: 0,
        },
        audioSrc: audioSrc,
      };

      if (isMain) {
        mainRemoteDispatch({
          type: 'add',
          remote: newRemoteInfo,
        });
      } else {
        subRemoteDispatch({
          type: 'add',
          remote: newRemoteInfo,
        });
      }
    });

    room.on('data', ({ data, src }) => {
      // SubRoomにお互い入るためのやりとり
      if (data.msg === 'REQ_NEW_JOIN') {
        joinTrigger({ isMain: false, firstId: src, secondId: peer.id });
        room.send({
          msg: 'RES_NEW_JOIN',
          to: src,
        });
      } else if (data.msg === 'RES_NEW_JOIN') {
        if (data.to === peer.id) {
          joinTrigger({ isMain: false, firstId: peer.id, secondId: src });
        }
      }
    });

    room.on('peerLeave', (peerID) => {
      console.log(`=== ${peerID} left ===`);
    });

    room.once('close', () => {
      console.log('=== You left ===');
    });

    if (joinParams.isMain) {
      setMainRoom(room);
    } else {
      setSubRoom(room);
    }
  };

  useEffect(() => {
    if (!localStream) return;
    joinTrigger({ isMain: true });
  }, [localStream]);

  const unmuteHandler = (unmuteSubId: number = -1) => {
    console.log('unmuteHandler');
    const mainUnmute = unmuteSubId === -1;
    mainLocalStream.getAudioTracks()[0].enabled = mainUnmute;
    subLocalStreamDispatch({
      type: 'setMute',
      unmuteId: unmuteSubId,
    });
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Grid container direction="column">
          {mainRemotes.map((rem: RemoteInfo, id: number, array) => (
            <Grid item key={id}>
              <SubTalk
                talkNum={array.length}
                unmuteHandler={() => unmuteHandler(id)}
              />
              {/* <button onClick={() => muteHandler(id)}>unmute</button> */}
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <MainTalk unmuteHandler={() => unmuteHandler()} />
        {/* <button onClick={() => muteHandler()}>unmute</button> */}
        {/* <button
          onClick={() => {
            console.log(subLocalStreams);
            subLocalStreams.map((stream) => {
              console.log(stream.getAudioTracks()[0].enabled);
            });
          }}
        ></button> */}
      </Grid>
      {/* <Link to="/" onClick={() => handleLeave()}>
          LeaveRoom
        </Link> */}
    </Grid>
  );
};
