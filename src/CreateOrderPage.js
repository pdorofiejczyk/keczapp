import React, { Component } from "react";
import { Form, Icon } from 'semantic-ui-react';
import firebase from './firebase';

class CreateOrderPage extends Component {
  state = {name: '', price: '', status: 'new', userId: firebase.auth().currentUser.uid}

  onCreateOrder = (event) => {
  	firebase.firestore().collection('/orders').add(
  		this.state
  	).then((docRef) => {
	  	this.setState({name: '', price: ''});
	    this.props.history.push('/order/' + docRef.id);
	})
	.catch((error) => {
	    console.error("Error adding document: ", error);
	});
  }

  onChange = (e, { name, value }) => this.setState({ [name]: value })

  render () {
  	const {name, price} = this.state;

  	return (<Form onSubmit={this.onCreateOrder}>
  		      <Form.Group widths='equal'>
          <Form.Input placeholder='Restaurant name' name='name' value={name} onChange={this.onChange} />
          <Form.Input placeholder='Delivery price' name='price' value={price} onChange={this.onChange} />
          <Form.Button icon labelPosition='left'><Icon name='plus square' />Utwórz zamówienie</Form.Button>
          </Form.Group>
        </Form>
);
  }
}

export default CreateOrderPage;