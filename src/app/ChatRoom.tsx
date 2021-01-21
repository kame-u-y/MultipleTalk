import React, { useState, useEffect, useReducer, useMemo } from 'react';
import { Redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { RoomStream, MeshRoom } from 'skyway-js';
import { ResonanceAudio } from 'resonance-audio';
import { Grid } from '@material-ui/core';
import { MainTalk, SubTalk } from './components/TalkPaper';
import { ChatRoomProps } from './interfaces/Props';
import { remoteReducer } from './reducers/remoteReducer';
import { streamReducer } from './reducers/streamReducer';
import { useChatRoomStyles } from './styles/chatRoomStyles';
import { messageReducer } from './reducers/messageReducer';
import { subRoomReducer } from './reducers/subRoomReducer';

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
  const [subLocalStreams, subLocalStreamDispatch] = useReducer(
    streamReducer,
    []
  );

  const peer = useMemo(() => props.peer, []);
  const [mainRoom, setMainRoom] = useState<MeshRoom>(null);
  const [subRooms, subRoomDispatch] = useReducer(subRoomReducer, {});
  const [remotes, remoteDispatch] = useReducer(remoteReducer, []);
  const [currentUnmuteId, setCurrentUnmuteId] = useState(-1);

  const [messages, messageDispatch] = useReducer(messageReducer, {});

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
      | {
          isMain: false;
          firstId: string;
          secondId: string;
          partnerName: string;
        }
  ) => {
    if (!audioCtx) {
      alert('AudioContext is not initialized');
      return;
    }
    if (!peer.open) {
      alert('peer is not open');
      return;
    }

    // const newLocalStream = new MediaStream();
    // newLocalStream.addTrack(localStream.clone().getAudioTracks()[0]);
    const newLocalStream = localStream.clone();
    newLocalStream.getAudioTracks()[0].enabled = joinParams.isMain
      ? true
      : false;

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
          type: 'REQ_NEW_JOIN',
          userName: props.location.state.displayName,
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

      if (joinParams.isMain === false) {
        console.log(joinParams.partnerName);
        remoteDispatch({
          type: 'add',
          payload: {
            peerId: stream.peerId,
            roomName: room.name,
            userName: joinParams.partnerName,
          },
        });
      }
    });

    room.on('data', ({ data, src }) => {
      // SubRoomにお互い入るためのやりとり
      if (data.type === 'REQ_NEW_JOIN') {
        joinTrigger({
          isMain: false,
          firstId: src,
          secondId: peer.id,
          partnerName: data.userName,
        });
        room.send({
          type: 'RES_NEW_JOIN',
          to: src,
          userName: props.location.state.displayName,
        });
      } else if (data.type === 'RES_NEW_JOIN') {
        if (data.to === peer.id) {
          joinTrigger({
            isMain: false,
            firstId: peer.id,
            secondId: src,
            partnerName: data.userName,
          });
        }
      } else if (data.type === 'MESSAGE') {
        // {room, id, msg}
        messageDispatch({
          type: 'add',
          payload: { room: room.name, msg: data.msg, fromMyself: false },
        });
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
      subRoomDispatch({
        type: 'add',
        payload: {
          roomName: room.name,
          room: room,
        },
      });
    }
  };

  useEffect(() => {
    if (!localStream) return;
    joinTrigger({ isMain: true });
  }, [localStream]);

  const unmuteHandler = (unmuteId: number = -1) => {
    console.log('unmuteHandler');
    const currentMainState = mainLocalStream.getAudioTracks()[0].enabled;
    const isMainUnmute = !currentMainState && unmuteId === -1;
    mainLocalStream.getAudioTracks()[0].enabled = isMainUnmute;

    subLocalStreamDispatch({
      type: 'setMute',
      unmuteId: unmuteId,
    });
    setCurrentUnmuteId(currentUnmuteId !== unmuteId ? unmuteId : -999);
  };

  const sendMessageHandler = (
    isMain: boolean,
    roomName: string,
    msg: string
  ) => {
    const room = isMain ? mainRoom : subRooms[roomName];
    room.send({
      type: 'MESSAGE',
      msg: msg,
    });
    messageDispatch({
      type: 'add',
      payload: { room: roomName, msg: msg, fromMyself: true },
    });
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Grid container direction="column">
          {remotes.map((remo, id: number, array) => (
            <Grid item key={id}>
              <SubTalk
                talkNum={array.length}
                unmuteColor={currentUnmuteId === id}
                title={remo.userName}
                messages={
                  messages[remo.roomName] ? messages[remo.roomName] : []
                }
                unmuteHandler={() => unmuteHandler(id)}
                sendMessageHandler={(msg: string) =>
                  sendMessageHandler(false, remo.roomName, msg)
                }
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <MainTalk
          unmuteColor={currentUnmuteId === -1}
          title={'Main Talk'}
          messages={
            mainRoom
              ? messages[mainRoom.name]
                ? messages[mainRoom.name]
                : []
              : []
          }
          unmuteHandler={() => {
            unmuteHandler(-1);
          }}
          sendMessageHandler={(msg: string) =>
            sendMessageHandler(true, mainRoom.name, msg)
          }
        />
      </Grid>
      {/* <Link to="/" onClick={() => handleLeave()}>
          LeaveRoom
        </Link> */}
    </Grid>
  );
};
