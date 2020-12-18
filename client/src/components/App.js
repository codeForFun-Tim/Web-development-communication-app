import { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import MainPage from './MainPage';
import Profile from './Profile';
import Status from './Status';
import ForgetPassword from './ForgetPassword';
import OtherProfile from './OtherProfile';

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
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/main">
            <MainPage />
          </Route>
          <Route exact path="/status">
            <Status />
          </Route>
          <Route exact path="/changePassword">
            <ForgetPassword />
          </Route>
          <Route exact path="/otherProfile/:otherUser">
            <OtherProfile />
          </Route>
        </div>
      </Router>
    );
  }
}

export default App;
