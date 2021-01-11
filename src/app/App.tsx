import React, { useMemo } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Peer from 'skyway-js';
import { GivenProps } from './interfaces/Props';
import Home from './Home';
import ChatRoom from './ChatRoom';

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
