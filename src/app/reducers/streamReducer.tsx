// interface SubLocalStream {
//   stream: MediaStream;
// }

interface AddAction {
  type: 'add';
  stream: MediaStream;
}

interface UnmuteAction {
  type: 'setMute';
  unmuteId: number;
}

export const streamReducer = (
  state: Array<MediaStream>,
  action: AddAction | UnmuteAction
): Array<MediaStream> => {
  if (action.type === 'add') {
    return [...state, action.stream];
  } else if (action.type === 'setMute') {
    return state.map((stream: MediaStream, id: number) => {
      const unmute = id === action.unmuteId;
      const nowUnmute = stream.getAudioTracks()[0].enabled;
      console.log(`${id} ${unmute}`);
      stream.getAudioTracks()[0].enabled = unmute && !nowUnmute ? true : false;
      return stream;
    });
  }
};
