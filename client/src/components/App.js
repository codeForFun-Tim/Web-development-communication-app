import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './login';
import Register from './Register';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/"> <Login /></Route>
          <Route exact path="/login"> <Login /></Route>
          <Route exact path="/Register"> <Register /></Route>
        </div>
      </Router>
    );
  }
}

export default App;
