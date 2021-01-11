import { RouteComponentProps } from 'react-router-dom';
import { Location } from 'history';
import Peer from 'skyway-js';

export interface GivenProps extends RouteComponentProps {
  location: Location<{
    roomName: string;
    displayName: string;
  }>;
}

export interface ChatRoomProps extends GivenProps {
  peer: Peer;
}
