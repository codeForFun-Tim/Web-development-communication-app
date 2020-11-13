import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './login';
import Register from './Register';
import MainPage from './MainPage';
import Profile from './Profile';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/Register">
            <Register />
          </Route>
          <Route exact path="/main">
            <MainPage />
          </Route>
          <Route exact path="/Profile">
            <Profile />
          </Route>
        </div>
      </Router>
    );
  }
}

export default App;
