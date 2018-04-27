import React, { Component } from "react";
import { Table, Button, Icon } from "semantic-ui-react";
import firebase from "./firebase";

const getUserName = (userId, users) => {
  return users[userId] ? users[userId].displayName : "";
};

const OrderList = props => {
  const list =
    props.items.length === 0 ? (
      <Table.Row>
        <Table.Cell colSpan="4">Brak zamówień</Table.Cell>
      </Table.Row>
    ) : (
      props.items.map(({ name, price, userId }, index) => (
        <Table.Row>
          <Table.Cell>{index}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{getUserName(userId, props.users)}</Table.Cell>
          <Table.Cell collapsing textAlign="right">
            {price} zł
          </Table.Cell>
        </Table.Row>
      ))
    );

  const footer =
    props.orderData &&
    props.orderData.userId === firebase.auth().currentUser.uid ? (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan="4">
            <Button
              icon
              floated="right"
              labelPosition="left"
              size="small"
              onClick={props.onFinalize}
              positive
            >
              <Icon name="cart" /> Finalizuj zamówienie
            </Button>
            <Button size="small" onClick={props.onCancel} negative>
              Anuluj zamówienie
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    ) : (
      <div />
    );

  return (
    <Table celled striped>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan="4">Lista zamówień</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{list}</Table.Body>
      {footer}
    </Table>
  );
};

export default OrderList;
