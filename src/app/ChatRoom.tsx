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
        // const newMainLocalStream = new MediaStream();
        // newMainLocalStream.addTrack(stream.clone().getAudioTracks()[0]);

        // const newSubLocalStream = new MediaStream();
        // newSubLocalStream.addTrack(stream.clone().getAudioTracks()[0]);
        // newSubLocalStream.getAudioTracks()[0].enabled = false;

        setLocalStream(stream);
        // setMainLocalStream(newMainLocalStream);
        // setSubLocalStream(newSubLocalStream);
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

    // const initRoom = (isMain: boolean, firstId = '', secondId = ''): void => {
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

      // const dataConnection = peer.connect(src);
      // dataConnection.on('open', () => {
      //   const data = {
      //     type: 'RES_NEW_JOIN',
      //   };
      //   dataConnection.send(data);
      // });
      // dataConnection.close();
      // peer.on('connection', (dataConnection) => {
      //   dataConnection.on('data', ({ res }) => {
      //     console.log(`${res}`);
      //     console.log(dataConnection.remoteId);
      //     joinTrigger({
      //       isMain: false,
      //       firstId: peer.id,
      //       secondId: dataConnection.remoteId,
      //     });
      //     dataConnection.close();
      //   });
      // });
      if (room.name === `${props.location.state.roomName}_main`) {
        room.send({
          msg: 'REQ_NEW_JOIN',
        });
      }
      // console.log('hoge');
      // const roomConnections = room.connections;
      // console.log(roomConnections);
      // console.log(roomConnections.length);
      // console.log(Object.keys(roomConnections));
      // console.log(typeof roomConnections);
      // console.log(roomConnections[0]);
      // console.log(mainRemotes);
      // console.log('hoge');
      // console.log(peer.getConnection());
      // console.log(roomConnections);
      // Object.entries(roomConnections).forEach(([key, value]) => {
      //   console.log(key, value);
      // });
      // Object.keys(roomConnections).forEach((peerId) => {
      // });

      // joinTrigger({
      //   isMain: false,
      //   firstId: peer.id,
      //   secondId: peerId,
      // });

      // for (let v in roomConnections) {
      //   console.log(v);
      // }
    });

    room.on('peerJoin', (peerId) => {
      console.log(`=== ${peerId} joined ===`);
    });

    room.on('stream', async (stream: RoomStream) => {
      console.log('stream event');
      // resonance audioのノードの追加
      const audioSrc = resonanceAudio.createSource();
      const isMain = room.name === `${props.location.state.roomName}_main`;
      audioSrc.setPosition(isMain ? 0.7 : -0.7, 0, 0);
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
      // RemoteInfoの形をいじればいい感じになるかも
      // やっぱいらないかも？mainとsubの区別すらいらないかも？
      // mainのremote userが増えた時にsubを増やすためにmainのが欲しいわ
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
      ///////////////////
    });

    room.on('data', ({ data, src }) => {
      // テキストデータを送信
      console.log(data);
      if (data.msg === 'REQ_NEW_JOIN') {
        // 返信側です
        // new remote roomをやるぞ
        joinTrigger({ isMain: false, firstId: src, secondId: peer.id });
        // const dataConnection = peer.connect(src);
        // dataConnection.on('open', () => {
        const data = {
          msg: 'RES_NEW_JOIN',
          to: src,
        };
        room.send(data);
        // });
        // dataConnection.on('error', () => {
        //   console.warn('error occured');
        // });
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
    // };
    // initRoom(true);
    // initRoom(false);
    // initRoom(isMain, newUserName);
  };

  useEffect(() => {
    if (!localStream) return;
    joinTrigger({ isMain: true });
  }, [localStream]);

  // useEffect(() => {
  //   console.log('sub');
  //   joinTrigger(false);
  // }, [mainRemotes]);

  // const handleLeave = () => {
  //   setCookie('roomName', '');
  //   setCookie('displayName', '');
  // };

  const muteHandler = (unmuteSubId: number) => {
    // if (unmuteSubId === -1) {
    //   mainLocalStream.getAudioTracks()[0].enabled = true;
    //   subLocalStreamDispatch;
    // }
    console.log(`unmute: ${unmuteSubId}`);
    console.log(subLocalStreams);
    const mainUnmute = unmuteSubId === -1;
    mainLocalStream.getAudioTracks()[0].enabled = mainUnmute;
    // const toggle: boolean = mainLocalStream.getAudioTracks()[0].enabled;
    // mainLocalStream.getAudioTracks()[0].enabled = !toggle;
    // subLocalStream.getAudioTracks()[0].enabled = toggle;
    subLocalStreamDispatch({
      type: 'setMute',
      unmuteId: unmuteSubId,
    });
  };

  useEffect(() => {
    //
  }, [mainRemotes]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={6}>
        <Grid container direction="column">
          {mainRemotes.map((rem: RemoteInfo, id: number, array) => (
            <Grid item key={id}>
              <SubTalk talkNum={array.length} />
              <button onClick={() => muteHandler(id)}>unmute</button>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <MainTalk />
        <button onClick={() => muteHandler(-1)}>mutete</button>
        <button
          onClick={() => {
            console.log(subLocalStreams);
            subLocalStreams.map((stream) => {
              console.log(stream.getAudioTracks()[0].enabled);
            });
          }}
        ></button>
      </Grid>
      {/* <Link to="/" onClick={() => handleLeave()}>
          LeaveRoom
        </Link> */}
    </Grid>
  );
};

///////////////////
