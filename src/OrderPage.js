import React, { Component } from "react";
import OrderList from "./OrderList";
import AddOrderForm from "./AddOrderForm";
import firebase from './firebase';
import { Message, Loader } from 'semantic-ui-react';

class OrderPage extends Component {
  state = null;


  componentDidMount() {
    this.docRef = firebase.firestore().collection('/orders').doc(this.props.match.params.id);
    this.userProfileRef = firebase.firestore().collection('/userProfile');

    this.userProfileRef.onSnapshot((querySnapshot) => {
      const users = [];

      querySnapshot.forEach((doc) => {
        users[doc.id] = doc.data();
      });

      this.setState({
        users
      });
    });

    this.docRef.onSnapshot((doc) => {
      this.setState({
        orderData: doc.data()
      });
      console.log(doc.data());
    });

    this.itemsRef = this.docRef.collection('/items');

    this.itemsRef.onSnapshot((querySnapshot) => {
      const items = [];

      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });

      this.setState({
        items
      });
    });
  }

  onAddOrderItem = (item) => {
    this.itemsRef.add(item).catch((error) => {
      console.log("Error adding item: ", error);
    });
  }

  onCancel = () => {
    this.docRef.update({
      status: "canceled"
    }).then(() => {
      console.log("canceled");
    }).catch((error) => {
      console.log("Error canceling: ", error);
    });
  }

  onFinalize = () => {
    this.docRef.update({
      status: "closed"
    }).then(() => {
      console.log("closed");
    }).catch((error) => {
      console.log("Error finalizing: ", error);
    });
  }

  getStatusInfo = (status) => {
    switch (status) {
      case "canceled":
        return (<Message negative>
                  <Message.Header>Zamówienie anulowane</Message.Header>
                  <p>Zamówienie zostało anulowane i nie zostanie zrealizowane.</p>
                </Message>);
      case "closed":
        return (<Message warning>
                  <Message.Header>Zamówienie sfinalizowane</Message.Header>
                  <p>Zamówienie zostało sfinalizowane. Nie możesz już nic dodać do zamówienia.</p>
                </Message>);
      default:
        return (<div></div>);
    }
  }

  render() {
    if (this.state === null || !this.state.orderData || !this.state.items || !this.state.users) {
      return (<Loader />);
    }

    const {orderData, items, users} = this.state;

    const info = this.getStatusInfo(orderData.status);

    const addOrderForm = orderData && orderData.status === "new" ? (
      <AddOrderForm onSubmit={ this.onAddOrderItem } />
      ) : (<div></div>);

    const orderInfo = orderData ? (<div>Zamówienie z:
                                     { orderData.name }, Koszt dostawy:
                                     { orderData.price } zł</div>) : (<div></div>);

    return (
      <div>
        { info }
        { orderInfo }
        <OrderList items={ items } users={ users } orderData={ orderData } onCancel={ this.onCancel } onFinalize={ this.onFinalize } />
        { addOrderForm }
      </div>
      );
  }
}
;

export default OrderPage;