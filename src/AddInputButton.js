import React, { Component } from "react";
import { Button, Icon, Input } from "semantic-ui-react";

class AddInputButton extends Component {
  state = {
    clicked: false
  };

  onClick = () => {
    this.setState({ clicked: !this.state.clicked });
  };

  render() {
    if (this.state.clicked) {
      return (
        <Input
          icon={<Icon name="delete" onClick={this.onClick} link />}
          placeholder="Nazwa uztkownika..."
        />
      );
    } else {
      return (
        <Button type="button" icon onClick={this.onClick}>
          <Icon name="plus" />
        </Button>
      );
    }
  }
}

export default AddInputButton;
