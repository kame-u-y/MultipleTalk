import { MeshRoom } from 'skyway-js';

interface SubRooms {
  [roomName: string]: MeshRoom;
}

interface SubRoomAction {
  type: 'add';
  payload: {
    roomName: string;
    room: MeshRoom;
  };
}

export const subRoomReducer = (state: SubRooms, action: SubRoomAction) => {
  if (action.type === 'add') {
    const newSubRooms = { ...state };
    newSubRooms[action.payload.roomName] = action.payload.room;
    return newSubRooms;
  }
};
