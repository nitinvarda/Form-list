import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Form from './components/Form';
import List from './components/List';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>

      <Navbar />
      <div className="App">
        <Switch>

          <Route path="/" exact strict component={Form} />
          <Route path="/list" component={List} />
        </Switch>

      </div>
    </Router>
  );
}

export default App;
