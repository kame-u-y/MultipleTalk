import { RemoteInfo } from '../interfaces/RemoteInfo';

interface AddRemoteAction {
  type: 'add';
  payload: {
    peerId: string;
    roomName: string;
    userName: string;
    // userName: '';
    // userIconSrc: '';
  };
}

export function remoteReducer(
  state: Array<RemoteInfo>,
  action: AddRemoteAction
): Array<RemoteInfo> {
  if (action.type === 'add') {
    return [
      ...state,
      {
        ...action.payload,
        userIconSrc: '',
      },
    ];
  } else if (action.type === 'remove') {
    return state.filter(
      (remo: RemoteInfo) => remo.peerId !== action.payload.peerId
    );
  }
}
