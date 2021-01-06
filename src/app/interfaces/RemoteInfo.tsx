import Peer, { RoomStream } from 'skyway-js';
import { Source } from 'resonance-audio';
import { UserOffset } from '../interfaces/UserOffset';

export interface RemoteInfo {
  peerID: string;
  stream: RoomStream;
  imgSrc: string;
  userOffset: UserOffset;
  audioSrc: Source;
}
