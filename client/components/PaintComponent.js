import React, { Component } from 'react'
import {Button} from 'react-bootstrap';

class PaintComponent extends Component
{
	constructor(props)
	{
		super(props);

		this.state =
			{
				mousePressed: false,
        context: null,

				coords:
					{
						x: 0,
						y: 0
					},

				canvasWrapperParams:
          {
            top: 0,
            left: 0,
            width: 0,
            height: 0
          },

        canvasParams:
          {
            width: 900,
            height: 750
          },

        drawingParams:
          {
            lineWidth: 1,
            minLineWidth: 1,
            maxLineWidth: 100
          }
			};

		this._onMouseDown = this._onMouseDown.bind(this);
		this._onMouseUp = this._onMouseUp.bind(this);
		this._onMouseLeave = this._onMouseLeave.bind(this);
		this._onMouseMove = this._onMouseMove.bind(this);

		this.updateCanvasWrapperParams = this.updateCanvasWrapperParams.bind(this);
		this.changeLineWidth = this.changeLineWidth.bind(this);
		this.handleEraseButton = this.handleEraseButton.bind(this);

		this.handleDrawButton = this.handleDrawButton.bind(this);
	}

	drawGist(c)
  {
    const data = [];
    for( let i = 0; i < 9 ; i ++ )
      data.push(Math.floor((Math.random()*10000)%100))

    ///======================

    c.fillStyle = "gray";
    for(let i=0; i<data.length; i++) {
      let dp = data[i];
      c.fillRect( 60 + i*90, this.state.canvasParams.height - dp*7 - 40 , 50, dp*7);
    }

    ///======================

    c.fillStyle = "black";
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(40,25);
    c.lineTo(40, this.state.canvasParams.height - 25 );
    c.lineTo(this.state.canvasParams.width - 25, this.state.canvasParams.height - 25 );
    c.stroke();

    ///======================

    c.fillStyle = "black";

    for(let i = 0; i < 9 ; i++ )
    {
      c.fillText((9-i)*10 + "", 10 , i*80 + 30);
      c.beginPath();

      c.moveTo(30,i*80+25+1);
      c.lineTo(40,i*80+25+1);
      c.stroke();
    }

    ///======================

    const labels = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP"];
    for(let i=0; i<labels.length; i++)
    {
      c.fillText( labels[i], 75 + i*90, this.state.canvasParams.height - 7 );
    }
  }

	drawRound(c)
  {
    const data = [];
    let total = 0;
    let radius = Math.min(this.state.canvasParams.width, this.state.canvasParams.height) / 2.5;

    const centerX = this.state.canvasParams.width / 2 ;
    const centerY = this.state.canvasParams.height / 2 ;

    let scale = ((new Date().getTime() / 1000)%10+1)/10;

    for( let i = 0; i < 125 ; i ++ )
    {
      data.push(Math.floor((Math.random()*10000)%100));
      total += data[i];
    }

    const colors = [ "orange", "green", "teal"];

    ///======================

    let prevAngle = 0;
    for(let i = 0; i < data.length; i++)
    {
      let fraction = data[i]/total;
      let angle = prevAngle + fraction * Math.PI*2;

      c.fillStyle = colors[i%3];

      c.beginPath();
      c.moveTo(centerX,centerY);
      c.arc(centerX,centerY, radius*scale, prevAngle, angle, false);
      c.lineTo(centerX,centerY);

      c.fill();

      c.strokeStyle = "black";
      c.stroke();

      prevAngle = angle;
    }
    setTimeout( () =>{this.drawRound(c)}, 150);

  }

  handleDrawButton()
  {
    const c = this.state.context;
    //this.drawGist(c);
    this.drawRound(c);
  }

  componentDidMount()
	{
    window.addEventListener("resize", this.updateCanvasWrapperParams);
		this.setState(
		  {
        canvasWrapperParams:  this.canvasWrapper.getBoundingClientRect(),
		    context: this.canvas.getContext('2d')
		  });
	}

	changeLineWidth(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.lineWidth = val;

    this.setState({drawingParams:drawingParams});
  }

  updateCanvasWrapperParams()
  {
    const canvasWrapperParams = this.canvasWrapper.getBoundingClientRect();
    this.setState({ canvasWrapperParams: canvasWrapperParams , canvasParams:{width:canvasWrapperParams.width, height:canvasWrapperParams.height}});
  }

  handleEraseButton(e)
  {
    this.state.context.clearRect(0, 0, this.state.canvasWrapperParams.width, this.state.canvasWrapperParams.height);
  }

	_onMouseDown(e)
	{
    this.state.context.lineWidth = this.state.drawingParams.lineWidth;

    this.state.context.beginPath();
		this.setState({mousePressed:true, coords:{x:e.pageX - this.state.canvasWrapperParams.left, y:e.pageY - this.state.canvasWrapperParams.top} });
	}

	_onMouseUp(e)
	{
		this.state.context.closePath();
		this.setState({mousePressed:false});
	}

	_onMouseLeave(e)
	{
		this.state.context.closePath();
		this.setState({mousePressed:false});
	}

	_onMouseMove(e)
	{
		if( this.state.mousePressed )
		{
			this.state.context.moveTo(this.state.coords.x, this.state.coords.y);
			this.state.context.lineTo((e.pageX - this.state.canvasWrapperParams.left), (e.pageY - this.state.canvasWrapperParams.top));
      this.state.context.stroke();

      this.setState({coords:{x:e.pageX - this.state.canvasWrapperParams.left, y:e.pageY - this.state.canvasWrapperParams.top}})
		}
	}

	render ()
	{
		return (

			<div id={"paintComponent"}>
        <div ref={(canvasWrapper) => { this.canvasWrapper = canvasWrapper; }}
             id={"canvasArea"}>
          <canvas onMouseDown={this._onMouseDown} onMouseUp={this._onMouseUp}
                  onMouseMove={this._onMouseMove} onMouseLeave={this._onMouseLeave}
                  ref={(canvas) => { this.canvas = canvas; }}
                  width={this.state.canvasParams.width} height={this.state.canvasParams.height}
          />
        </div>

				<div id={"instrumentsAreaRight"}>
					<div>

            <div id={"mouseCoordsContainer"}>
              <span className={"select-disabled"}> x: {" " + this.state.coords.x}  </span> <br/>
              <span className={"select-disabled"}> y: {" " + this.state.coords.y}  </span> <br/>
              <br className={"select-disabled"}/>
              <span className={"select-disabled"}> x offset: {" " + this.state.canvasWrapperParams.left}  </span> <br/>
              <span className={"select-disabled"}> y offset: {" " + this.state.canvasWrapperParams.top}  </span> <br/>
              <br className={"select-disabled"}/>
            </div>

            <hr className={"select-disabled"}/>

						<Button className={"select-disabled"} id={"drawButton"} block onClick={(e) => this.handleDrawButton(e)}>
              Draw
            </Button>

            <hr/>
						<Button className={"select-disabled"} id={"eraseButton"} block onClick={(e) => this.handleEraseButton(e)}>
              Erase
            </Button>

					</div>
				</div>

				<div id={"instrumentsAreaBottom"}>
				</div>

			</div>
		)
	}
}

export default PaintComponent