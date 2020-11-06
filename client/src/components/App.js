import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/"> <Login /></Route>
          <Route exact path="/login"> <Login /></Route>
        </div>
      </Router>
    );
  }
}

export default App;
