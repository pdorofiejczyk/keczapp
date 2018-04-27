import React, { Component } from "react";
import OrderList from "./OrderList";
import AddOrderForm from "./AddOrderForm";
import firebase from "./firebase";
import { Loader, Table } from "semantic-ui-react";
import { Link } from "react-router-dom";

class BalancePage extends Component {
  state = null;

  componentDidMount() {
    console.log(this.props.match.params);
    const uid = this.props.match.params.userId
      ? this.props.match.params.userId
      : firebase.auth().currentUser.uid;
    this.amountsRef = firebase
      .firestore()
      .collection("/balance")
      .doc(uid)
      .collection("amounts");
    this.historyRef = firebase
      .firestore()
      .collection("/balance")
      .doc(uid)
      .collection("history");

    this.userProfileRef = firebase.firestore().collection("/userProfile");

    this.userProfileRef.onSnapshot(querySnapshot => {
      const users = [];

      querySnapshot.forEach(doc => {
        users[doc.id] = doc.data();
      });

      this.setState({
        users
      });
    });

    this.amountsRef.onSnapshot(querySnapshot => {
      const amounts = [];
      querySnapshot.forEach(doc => {
        amounts.push({
          userId: doc.id,
          amount: doc.data().amount
        });
      });

      this.setState({
        amounts
      });
    });

    this.historyRef.onSnapshot(querySnapshot => {
      const history = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        history.push(data);
      });

      this.setState({
        history
      });
    });
  }

  getUserName = userId =>
    this.state.users ? this.state.users[userId].displayName || userId : userId;

  render() {
    if (
      !this.state ||
      !this.state.amounts ||
      !this.state.history ||
      !this.state.users
    ) {
      return <Loader active />;
    }

    const list = this.state.amounts.map(({ userId, amount }, index) => (
      <Table.Row>
        <Table.Cell>{index}</Table.Cell>
        <Table.Cell>{this.getUserName(userId)}</Table.Cell>
        <Table.Cell collapsing textAlign="right">
          {amount} zł
        </Table.Cell>
      </Table.Row>
    ));

    const history = this.state.history.map(
      ({ userId, orderId, amount, comment }, index) => (
        <Table.Row>
          <Table.Cell>{index}</Table.Cell>
          <Table.Cell>
            <Link
              to={{
                pathname: "/order/" + orderId
              }}
            >
              {orderId}
            </Link>
          </Table.Cell>
          <Table.Cell>{this.getUserName(userId)}</Table.Cell>
          <Table.Cell>{comment}</Table.Cell>
          <Table.Cell collapsing textAlign="right">
            {amount} zł
          </Table.Cell>
        </Table.Row>
      )
    );
    return (
      <div>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="3">Saldo</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{list}</Table.Body>
        </Table>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="5">Historia</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{history}</Table.Body>
        </Table>
      </div>
    );
  }
}
export default BalancePage;
