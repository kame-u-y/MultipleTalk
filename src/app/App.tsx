import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import ChatRoom from './ChatRoom';

const App: React.FC = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/chatroom" component={ChatRoom} />
    </Switch>
  </Router>
);

export default App;
