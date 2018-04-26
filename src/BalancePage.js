import React, { Component } from "react";
import OrderList from "./OrderList";
import AddOrderForm from "./AddOrderForm";
import firebase from './firebase';
import { Loader, Table } from 'semantic-ui-react';

class BalancePage extends Component {
  state = null;


  componentDidMount() {
    console.log(this.props.match.params);
    const uid = this.props.match.params.userId ? this.props.match.params.userId : firebase.auth().currentUser.uid;
    this.amountsRef = firebase.firestore().collection('/balance').doc(uid).collection("amounts");
    this.historyRef = firebase.firestore().collection('/balance').doc(uid).collection("history");

    this.amountsRef.onSnapshot((querySnapshot) => {
      const amounts = [];
      querySnapshot.forEach((doc) => {
        amounts.push({
          userId: doc.id,
          amount: doc.data().amount
        });
      });

      this.setState({
        amounts
      });
    });

    this.historyRef.onSnapshot((querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push(data);
      });

      this.setState({
        history
      });
    });
  }

  render() {
    if (!this.state || !this.state.amounts || !this.state.history) {
      return (<Loader />);
    }

    const list = this.state.amounts.map(({userId, amount}, index) => <Table.Row>
                                                                       <Table.Cell>
                                                                         { index }
                                                                       </Table.Cell>
                                                                       <Table.Cell>
                                                                         { userId }
                                                                       </Table.Cell>
                                                                       <Table.Cell collapsing textAlign='right'>
                                                                         { amount } zł</Table.Cell>
                                                                     </Table.Row>);

    const history = this.state.history.map(({userId, orderId, amount, comment}, index) => <Table.Row>
                                                                                            <Table.Cell>
                                                                                              { index }
                                                                                            </Table.Cell>
                                                                                            <Table.Cell>
                                                                                              { orderId }
                                                                                            </Table.Cell>
                                                                                            <Table.Cell>
                                                                                              { userId }
                                                                                            </Table.Cell>
                                                                                            <Table.Cell>
                                                                                              { comment }
                                                                                            </Table.Cell>
                                                                                            <Table.Cell collapsing textAlign='right'>
                                                                                              { amount } zł</Table.Cell>
                                                                                          </Table.Row>);
    return (
      <div>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='3'>Saldo</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { list }
          </Table.Body>
        </Table>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan='5'>Historia</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            { history }
          </Table.Body>
        </Table>
      </div>
      );
  }
}
;

export default BalancePage;