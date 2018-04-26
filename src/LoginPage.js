import React, { Component } from "react";
import { Icon, Button, Image } from 'semantic-ui-react';
import firebase from './firebase';

class LoginPage extends Component {

  state = {
    user: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user
        });
      }
    });
  }

  login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
      this.setState({
        user: result.user
      });
      console.log(this.state);
    // ...
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const {user} = this.state;
    return user ? (  <div>
                       <Image src={ user.photoURL } avatar />
                       <span>{ user.displayName }</span>
                     </div>) : (
      <Button color='google plus' onClick={ this.login }>
        <Icon name='google plus' /> Sign up with Gootle
      </Button>
      );
  }
}

export default LoginPage;