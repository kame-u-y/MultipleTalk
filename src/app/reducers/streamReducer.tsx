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
      const currentState = stream.getAudioTracks()[0].enabled;
      const isUnmute = !currentState && id === action.unmuteId;
      stream.getAudioTracks()[0].enabled = isUnmute;
      console.log(`${id}: ${isUnmute}`);
      return stream;
    });
  }
};
