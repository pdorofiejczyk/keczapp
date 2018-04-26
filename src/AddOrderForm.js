import React, { Component } from "react";
import { Form, Icon } from 'semantic-ui-react';
import firebase from './firebase';

class AddOrderForm extends Component {
  state = {
    name: '',
    price: '',
    userId: firebase.auth().currentUser.uid
  }

  onChange = (e, {name, value}) => this.setState({
    [name]: value
  })

  onSubmit = () => {
    this.props.onSubmit(this.state);
    this.setState({
      name: '',
      price: '',
      userId: firebase.auth().currentUser.uid
    });
  }

  render() {
    const {name, price} = this.state;

    return (<Form className="App" onSubmit={ this.onSubmit }>
              <Form.Group widths='equal'>
                <Form.Input placeholder='Name' name='name' value={ name } onChange={ this.onChange } />
                <Form.Input placeholder='Price' name='price' value={ price } onChange={ this.onChange } />
                <Form.Button icon labelPosition='left'>
                  <Icon name='plus square' />Dodaj do zamówienia</Form.Button>
              </Form.Group>
            </Form>
      );
  }
}

export default AddOrderForm;