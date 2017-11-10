import React, {Component, PropTypes} from 'react';
import {Form, FormControl, FormGroup, ControlLabel, Button} from 'react-bootstrap';

import Validator from '../../utils/validate';

class LoginForm extends Component
{
  state =
  {
    requirements:
    {
      minPasswordLength: 4,
      minLoginLength: 4
    },


    inputData:
    {
      login: "",
      password: "",

      changed:
      {
        login: false,
        password: false
      }
    }

  };

  //=========================================

  handleFieldChange(e)
  {
    let inputData = this.state.inputData;

    inputData[e.target.name] = e.target.value;
    inputData.changed[e.target.name] = true;

    this.setState({inputData:inputData});
  }

  handleSubmit(e)
  {
    e.preventDefault();

    // emit event to container
    if(this.state.inputData.password.length > this.state.requirements.minPasswordLength
      && this.state.inputData.login.length > this.state.requirements.minLoginLength)
    {
      this.props.onFormSubmit(this.state.inputData);
      this.clearInputs();
    }
  }

  clearInputs()
  {
    const cleanInput =
      {
        login: "",
        password: "",

        changed:
          {
            login: false,
            password: false
          }
      };

    this.setState({inputData: cleanInput})
  }

  //=========================================

  validateLogin()
  {
    return Validator.validateLoginInput(this.state.inputData.login);
  }

  validatePassword()
  {
    return Validator.validatePasswordInpit(this.state.inputData.password);
  }

  //=========================================

  render()
  {
    return (
      <Form method={"POST"} onSubmit={(e) => {this.handleSubmit(e)}}>


        <FormGroup validationState={this.state.inputData.changed.login ? this.validateLogin(this.state.inputData.login) : null}>

          <ControlLabel>
            Login
          </ControlLabel>

          <FormControl value={this.state.inputData.login} onChange={(e) => {this.handleFieldChange(e)}}
            name={"login"} type={"text"} placeholder={"Enter login..."}/>

        </FormGroup>


        <FormGroup validationState={this.state.inputData.changed.password ? this.validatePassword(this.state.inputData.password) : null}>

          <ControlLabel>
            Password
          </ControlLabel>

          <FormControl value={this.state.inputData.password} onChange={(e) => {this.handleFieldChange(e)}}
            name={"password"} type={"password"} placeholder={"Enter password..."}/>

        </FormGroup>


        <FormGroup>
          <Button type={"submit"} bsStyle={'success'}>
            Login
          </Button>
        </FormGroup>


      </Form>
    )
  }
}

export default LoginForm;