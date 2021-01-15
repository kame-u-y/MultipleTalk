import React, { useState, useEffect, useReducer } from 'react';
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

  const peer = props.peer;
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
  const joinTrigger = (isMain: boolean, newUserName: string = '') => {
    if (!audioCtx) {
      alert('AudioContext is not initialized');
      return;
    }
    if (!peer.open) {
      alert('peer is not open');
      return;
    }

    const initRoom = (isMain: boolean, newUserId: string = ''): void => {
      const newLocalStream = new MediaStream();
      newLocalStream.addTrack(localStream.clone().getAudioTracks()[0]);

      const attachedName = isMain ? 'main' : `sub_${newUserId}`;
      const room: MeshRoom = peer.joinRoom(
        // `${props.location.state.roomName}_${isMain ? 'main' : 'sub'}`,
        `${props.location.state.roomName}_${attachedName}`,
        {
          mode: 'mesh',
          // stream: isMain ? mainLocalStream : subLocalStream,
          stream: newLocalStream,
        }
      );
      if (isMain) {
        setMainLocalStream(newLocalStream);
      } else {
        subLocalStreamDispatch({
          type: 'add',
          stream: newLocalStream,
        });
      }

      room.once('open', () => {
        console.log('=== You joined ===');
      });

      room.on('peerJoin', (peerID) => {
        console.log(`=== ${peerID} joined ===`);
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
        initRoom(false, stream.peerId);
        // subRemoteDispatch({
        //   type: 'add',
        //   remote: newRemoteInfo,
        // });
      });

      room.on('data', ({ data, src }) => {
        // テキストデータを送信
      });

      room.on('peerLeave', (peerID) => {
        console.log(`=== ${peerID} left ===`);
      });

      room.once('close', () => {
        console.log('=== You left ===');
      });

      if (isMain) {
        setMainRoom(room);
      } else {
        setSubRoom(room);
      }
    };
    // initRoom(true);
    // initRoom(false);
    initRoom(isMain, newUserName);
  };

  useEffect(() => {
    if (!localStream) return;
    joinTrigger(true);
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
      </Grid>
      {/* <Link to="/" onClick={() => handleLeave()}>
          LeaveRoom
        </Link> */}
    </Grid>
  );
};

///////////////////
