import React, { useMemo } from 'react';
import {
  HashRouter as Router,
  Route,
  RouteComponentProps,
  Switch,
} from 'react-router-dom';
import Home from './Home';
import ChatRoom from './ChatRoom';
import Peer from 'skyway-js';
import { Location } from 'history';

interface GivenProps extends RouteComponentProps {
  location: Location<{
    roomName: string;
    displayName: string;
  }>;
}

const App: React.FC = () => {
  const peer: Peer = useMemo(
    () =>
      new Peer({
        key: 'fd3c4153-7356-46f2-a4d0-8aab4716e77c',
        debug: 3,
      }),
    []
  );
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/chatroom"
          render={(props: GivenProps) => <ChatRoom peer={peer} {...props} />}
        />
      </Switch>
    </Router>
  );
};

export default App;
