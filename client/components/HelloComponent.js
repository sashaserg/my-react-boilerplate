import React, {Component, PropTypes} from 'react';

class HelloComponent extends Component
{
  static propTypes =
    {
      parentProps: PropTypes.object
    };

  render()
  {
    return (
      <dev>

        <h1>
        This is dumb Home Page component.
        </h1>

        It works with props.
        <br/>


        Parent props:
        <br/>
        {JSON.stringify(this.props.parentProps)}

      </dev>
    )
  }
}

export default HelloComponent;