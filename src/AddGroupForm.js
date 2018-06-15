import React, { Component } from "react";
import { Form, Icon, List, Image, Label, Dropdown } from "semantic-ui-react";
import AddInputButton from "./AddInputButton";

class AddGroupForm extends Component {
  state = {
    noResultsMessage: "Nic nie znaleziono",
    options: []
  };
  //   onChange = (e, { name, value }) => {
  //     console.log(name, value);
  //   };

  onChange = (e, { name, value }) =>
    this.setState({
      [name]: value
    });

  handleAddition = (e, { value }) => {
    this.setState({
      options: [{ text: value, value }, ...this.state.options]
    });
  };

  handleChange = (e, { value }) => this.setState({ currentValues: value });

  render() {
    const { currentValues } = this.state;

    return (
      <Form className="App" onSubmit={this.onSubmit}>
        <Form.Input
          placeholder="Nazwa grupy"
          name="groupname"
          value={name}
          onChange={this.onChange}
        />
        <Form.Field>
          <Dropdown
            options={this.state.options}
            placeholder="Choose Languages"
            search
            selection
            fluid
            multiple
            allowAdditions
            value={currentValues}
            onAddItem={this.handleAddition}
            onChange={this.handleChange}
            additionLabel=""
          />
        </Form.Field>
      </Form>
    );
  }
}

export default AddGroupForm;
