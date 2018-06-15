import React, { Component } from "react";
import OrderPage from "./OrderPage";
import CreateOrderPage from "./CreateOrderPage";
import BalancePage from "./BalancePage";
import LoginPage from "./LoginPage";
import GroupsPage from "./GroupsPage";
import {
  Button,
  Image,
  Grid,
  Icon,
  Container,
  Loader,
  Dimmer,
  Divider
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
      this.setState({
        isLoading: false
      });

      if (user) {
        this.setState({
          user
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
        <Grid columns="equal" verticalAlign="middle">
          {top}
          <Grid.Row>
            <Grid.Column>
              <Router>
                <Switch>
                  <Route exact path="/" component={CreateOrderPage} />
                  <Route path="/order/:id" component={OrderPage} />
                  <Route path="/balance" component={BalancePage} />
                  <Route path="/balance/:userId" component={BalancePage} />
                  <Route path="/groups" component={GroupsPage} />
                </Switch>
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    ) : (
      <Dimmer active inverted>
        <Image src={logo} centered />
        <Divider hidden />
        <Button color="google plus" onClick={this.login}>
          <Icon name="google plus" /> Sign in with Google
        </Button>
      </Dimmer>
    );
  }
}

export default App;
