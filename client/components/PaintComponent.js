import React, { Component } from 'react'
import {Clearfix} from 'react-bootstrap';

class PaintComponent extends Component
{
	constructor(props)
	{
		super(props);

		this.state =
			{
				mousePressed: false,

				coords:
					{
						x: 0,
						y: 0
					},

				canvasParams:
          {
            top: 0,
            left: 0,
            width: 0,
            height: 0
          },

        drawingParams:
          {
            lineWidth: 5,
            minLineWidth: 1,
            maxLineWidth: 100
          }
			};

		this._onMouseDown = this._onMouseDown.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);

		this.updateCanvasParams = this.updateCanvasParams.bind(this);
		this.changeLineWidth = this.changeLineWidth.bind(this);
	}

  componentDidMount()
	{
    window.addEventListener("resize", this.updateCanvasParams);

		this.setState({ canvasParams:  this.canvas.getBoundingClientRect()});
	}

	changeLineWidth(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.lineWidth = val;

    this.setState({drawingParams:drawingParams});
  }

  updateCanvasParams()
  {
    this.setState({ canvasParams:  this.canvas.getBoundingClientRect()});
  }

	_onMouseDown(e)
	{
    this.canvas.getContext('2d').lineWidth = this.state.drawingParams.lineWidth;

    this.canvas.getContext('2d').beginPath();
		this.setState({mousePressed:true, coords:{x:e.pageX - this.state.canvasParams.left, y:e.pageY - this.state.canvasParams.top} });
	}

	_onMouseUp(e)
	{
		this.canvas.getContext('2d').closePath();
		this.setState({mousePressed:false});
	}

	_onMouseLeave(e)
	{
		this.canvas.getContext('2d').closePath();
		this.setState({mousePressed:false});
	}

	_onMouseMove(e)
	{
		if( this.state.mousePressed )
		{
			this.canvas.getContext('2d').moveTo(this.state.coords.x/3, this.state.coords.y/5);
			this.canvas.getContext('2d').lineTo((e.pageX - this.state.canvasParams.left)/3, (e.pageY - this.state.canvasParams.top)/5);
      this.canvas.getContext('2d').stroke();

      this.setState({coords:{x:e.pageX - this.state.canvasParams.left, y:e.pageY - this.state.canvasParams.top}})
		}
	}

	render ()
	{
		return (

			<div id={"paintComponent"}>

				<canvas onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp}
				        onMouseMove={this._onMouseMove} onMouseLeave={this._onMouseLeave}
				        ref={(canvas) => { this.canvas = canvas; }} id={"canvasArea"}/>

				<div id={"instrumentsAreaRight"}>
					<div>
						<span> x: {" " + this.state.coords.x}  </span> <br/>
						<span> y: {" " + this.state.coords.y}  </span> <br/>

						<br/>
						<br/>

						<span> x offset: {" " + this.state.canvasParams.left}  </span> <br/>
						<span> y offset: {" " + this.state.canvasParams.top}  </span> <br/>
					</div>
				</div>

				<div id={"instrumentsAreaBottom"}>
          <Clearfix>
          </Clearfix>
				</div>

			</div>
		)
	}
}

export default PaintComponent