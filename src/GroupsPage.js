import React, { Component } from "react";
import firebase from "./firebase";
import { Card, Label, Image, Icon, Button, Modal } from "semantic-ui-react";
import AddGroupForm from "./AddGroupForm";

export default class GroupsPage extends Component {
  render() {
    return (
      <div>
        <Card.Group>
          <Card>
            <Card.Content header="Jedzonie" />
            <Card.Content>
              <Label as="a">
                <Image
                  avatar
                  spaced="right"
                  src="/assets/images/avatar/small/elliot.jpg"
                />
                Elliot
              </Label>

              <Label as="a">
                <Image
                  avatar
                  spaced="right"
                  src="/assets/images/avatar/small/elliot.jpg"
                />
                Elliot
              </Label>
            </Card.Content>
            <Card.Content extra>
              <Button.Group size="tiny" floated="right">
                <Button icon basic>
                  <Icon name="edit" />Edytuj
                </Button>
              </Button.Group>
            </Card.Content>
          </Card>
          <Card>
            <Card.Content header="Kasztaniaki" />
            <Card.Content>
              <Label as="a">
                <Image
                  avatar
                  spaced="right"
                  src="/assets/images/avatar/small/elliot.jpg"
                />
                Elliot
              </Label>
              <Label as="a">
                <Image
                  avatar
                  spaced="right"
                  src="/assets/images/avatar/small/elliot.jpg"
                />
                Elliot
              </Label>
            </Card.Content>
            <Card.Content extra>
              <Button.Group size="tiny" floated="right">
                <Button icon basic color="red">
                  <Icon name="sign out" />Opuść
                </Button>
              </Button.Group>
            </Card.Content>
          </Card>
        </Card.Group>
        <Modal
          trigger={
            <Button
              icon
              floated="right"
              labelPosition="left"
              size="small"
              positive
            >
              <Icon name="group" /> Utwórz grupę
            </Button>
          }
        >
          <Modal.Header>Tworzenie grupy</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <AddGroupForm />
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
