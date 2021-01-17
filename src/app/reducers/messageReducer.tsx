import { MessageInfo } from '../interfaces/MessageInfo';

interface Messages {
  [room: string]: Array<MessageInfo>;
}

interface InitRoomArrayAction {
  type: 'initRoomArray';
  payload: {
    room: string;
  };
}

interface AddMessageAction {
  type: 'add';
  payload: {
    room: string;
    msg: string;
    fromMyself: boolean;
  };
}

export const messageReducer = (
  state: Messages,
  action: InitRoomArrayAction | AddMessageAction
): Messages => {
  if (action.type === 'initRoomArray') {
    state[action.payload.room] = [];
  } else if (action.type === 'add') {
    const newMessages = { ...state };
    if (!newMessages[action.payload.room]) {
      newMessages[action.payload.room] = [];
    }
    newMessages[action.payload.room].push({
      msg: action.payload.msg,
      fromMyself: action.payload.fromMyself,
    });
    return newMessages;
  }
};
