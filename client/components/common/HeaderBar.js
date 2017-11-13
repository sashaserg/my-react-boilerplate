import React, {Component} from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';


class HeaderBar extends Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (

      <Navbar id={"HeaderBar"}>


        <Navbar.Header>

          <Navbar.Brand>
            <LinkContainer to={'/'}>
              <span>
                ProjectName
              </span>
            </LinkContainer>
          </Navbar.Brand>

        </Navbar.Header>


        <Nav>

          <LinkContainer to={'/home'}>
            <NavItem>
              <span>
                Home
              </span>
            </NavItem>
          </LinkContainer>

          <LinkContainer to={'/login'}>
            <NavItem>
              <span>
                Login
              </span>
            </NavItem>
          </LinkContainer>

          {this.props.user
            ?
              <LinkContainer to={'/home'}>
                <NavItem>
                  <span>
                    Hello
                  </span>
                </NavItem>
              </LinkContainer>
            :
              null
          }
        </Nav>


      </Navbar>
    )
  }
}

export default HeaderBar