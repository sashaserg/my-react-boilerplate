import React, {Component} from 'react';
import {Clearfix} from 'react-bootstrap';
import {Link} from 'react-router-dom';

class FooterGeneral extends Component
{
  constructor(props)
  {
    super(props);
  }



  render()
  {
    return (

      <Clearfix id={"FooterGeneral"}>

        <h1>
          This is Footer
        </h1>

      </Clearfix>
    )
  }
}

export default FooterGeneral