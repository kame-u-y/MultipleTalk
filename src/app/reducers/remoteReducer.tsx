import { RemoteInfo } from '../interfaces/RemoteInfo';

export const DefaultRemoteInfo: RemoteInfo = {
  peerID: '',
  stream: null,
  imgSrc: '',
  userOffset: {
    x: 0,
    z: 0,
  },
  audioSrc: null,
};

// このreducerでは結果オブジェクトのArrayを更新してるから引数もArray
export function remoteReducer(
  state: Array<RemoteInfo>,
  action: {
    type: string;
    remote: RemoteInfo;
  }
): Array<RemoteInfo> {
  if (action.type === 'add') {
    return [...state, action.remote];
  } else if (action.type === 'remove') {
    return state.filter(
      (remo: RemoteInfo) => remo.peerID !== action.remote.peerID
    );
  } else if (action.type === 'updateUserOffset') {
    return state.map((remo: RemoteInfo) =>
      remo.peerID === action.remote.peerID
        ? {
            ...remo,
            userOffset: action.remote.userOffset,
            audioSrc: action.remote.audioSrc,
          }
        : remo
    );
  }
}
