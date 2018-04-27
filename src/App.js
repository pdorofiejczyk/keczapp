import React, { Component } from "react";
import OrderPage from "./OrderPage";
import CreateOrderPage from "./CreateOrderPage";
import BalancePage from "./BalancePage";
import LoginPage from "./LoginPage";
import {
  Button,
  Image,
  Grid,
  Icon,
  Container,
  Loader,
  Dimmer
} from "semantic-ui-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from "../keczapp.png";
import firebase from "./firebase";

class App extends Component {
  state = {
    user: null,
    isLoading: true
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          user,
          isLoading: false
        });
      }
    });
  }

  login = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        this.setState({
          user: result.user
        });
        console.log(this.state);
        // ...
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (this.state.isLoading) {
      return <Loader active />;
    }

    const { user } = this.state;
    const userInfo = user ? (
      <div>
        <Image src={user.photoURL} avatar />
        <span>{user.displayName}</span>
      </div>
    ) : null;

    const top = (
      <Grid.Row>
        <Grid.Column>
          <Image src={logo} />
        </Grid.Column>
        <Grid.Column textAlign="right">{userInfo}</Grid.Column>
      </Grid.Row>
    );

    return this.state.user ? (
      <Container>
        <Grid columns="equal">
          {top}
          <Grid.Row>
            <Grid.Column>
              <Router>
                <Switch>
                  <Route exact path="/" component={CreateOrderPage} />
                  <Route path="/order/:id" component={OrderPage} />
                  <Route path="/balance" component={BalancePage} />
                  <Route path="/balance/:userId" component={BalancePage} />
                </Switch>
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    ) : (
      <Grid columns="equal">
        {top}
        <Grid.Row>
          <Grid.Column>
            <Button color="google plus" onClick={this.login}>
              <Icon name="google plus" /> Sign in with Google
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default App;
