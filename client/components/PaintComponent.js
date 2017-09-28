import React, { Component } from 'react'

import {Button, Clearfix, Col, FormControl, Form, Modal} from 'react-bootstrap';
import {PhotoshopPicker, HuePicker} from 'react-color'
import Slider from 'nw-react-slider';

// =============== POLY ===================
window.requestAnimFrame = (function()
{
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function( callback )
    {
      window.setTimeout(callback, 1000 / 60);
    };
})();
//=============================================

class PaintComponent extends Component {

  constructor(props) {
    super(props);

    this.state =
      {
        showColorPicker: false,
        mousePressed: false,
        context: null,

        coords: {x: 0, y: 0},

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
            lineWidth: 5,
            minLineWidth: 1,
            maxLineWidth: 100,
            selectedFilter: "color",
            color: "#00FF00",
            newColor: "#00FF00"
          },

        availableFilters:
          [
            {value: "xor", name: "XOR"},
            {value: "overlay", name: "Overlay"}, {value: "darken", name: "Darken"}, {value: "lighten", name: "Lighten"},
            {value: "color-dodge", name: "Color dodge"}, {value: "color-burn", name: "Color burn"},
            {value: "hard-light", name: "Hard light"},
            {value: "soft-light", name: "Hard light"}, {value: "difference", name: "Difference"},
            {value: "exclusion", name: "Exclusion"},
            {value: "hue", name: "HUE"}, {value: "saturation", name: "Saturation"}, {value: "color", name: "Color"},
            {value: "luminosity", name: "Luminosity"}, {value: "lighter", name: "Luminosity"}
          ],

        animationParams:
          {
            particles: []
          }
      };

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);

    this.updateCanvasWrapperParams = this.updateCanvasWrapperParams.bind(this);
    this.changeLineWidth = this.changeLineWidth.bind(this);
    this.handleEraseButton = this.handleEraseButton.bind(this);

  }

  drawGist(c) {
    const data = [];
    for (let i = 0; i < 9; i++)
      data.push(Math.floor((Math.random() * 10000) % 100))

    ///======================

    c.fillStyle = "gray";
    for (let i = 0; i < data.length; i++) {
      let dp = data[i];
      c.fillRect(60 + i * 90, this.state.canvasParams.height - dp * 7 - 40, 50, dp * 7);
    }

    ///======================

    c.fillStyle = "black";
    c.lineWidth = 2.0;
    c.beginPath();
    c.moveTo(40, 25);
    c.lineTo(40, this.state.canvasParams.height - 25);
    c.lineTo(this.state.canvasParams.width - 25, this.state.canvasParams.height - 25);
    c.stroke();

    ///======================

    c.fillStyle = "black";

    for (let i = 0; i < 9; i++) {
      c.fillText((9 - i) * 10 + "", 10, i * 80 + 30);
      c.beginPath();

      c.moveTo(30, i * 80 + 25 + 1);
      c.lineTo(40, i * 80 + 25 + 1);
      c.stroke();
    }

    ///======================

    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
    for (let i = 0; i < labels.length; i++) {
      c.fillText(labels[i], 75 + i * 90, this.state.canvasParams.height - 7);
    }
  }

  drawSnow() {
    window.requestAnimFrame(this.draw);

    this.createParticles();
    this.updateParticles();
    this.killParticles();
    this.drawParticles();
  }

  createParticles() {
    let particles = this.state.animationParams.particles;

    if (particles.length < 100) {
      particles.push(
        {
          x: Math.random() * this.state.canvasParams.width,
          y: 0,
          speed: 2 + Math.random() * 3,
          radius: 5 + Math.random() * 5,
          color: "white",
        });
    }

    this.setState({animationParams: {particles: particles}});
  }

  updateParticles() {
    let particles = this.state.animationParams.particles;

    for (let i in particles) {
      let part = particles[i];
      part.y += part.speed;
    }

    this.setState({animationParams: {particles: particles}});
  }

  killParticles() {
    let particles = this.state.animationParams.particles;

    for (let i in particles) {
      let part = particles[i];
      if (part.y > this.state.canvasParams.height) {
        part.y = 0;
      }
    }

    this.setState({animationParams: {particles: particles}});
  }

  drawParticles() {
    let particles = this.state.animationParams.particles;
    const c = this.state.context;

    c.fillStyle = "black";
    c.fillRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
    for (let i in particles) {
      let part = particles[i];
      c.beginPath();
      c.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
      c.closePath();
      c.fillStyle = part.color;
      c.fill();
    }

    this.setState({animationParams: {particles: particles}});
  }

  draw(c) {
    let data = c.createImageData(this.state.canvasParams.width, this.state.canvasParams.height);

    for (let x = 0; x < data.width; x++) {
      for (let y = 0; y < data.height; y++) {

        let val = 0;
        let horz = (Math.floor(x / 10) % 2 == 0);
        let vert = (Math.floor(y / 10) % 2 == 0);

        if ((horz && !vert) || (!horz && vert)) {
          val = 150;
        }
        else {
          val = 50;
        }

        let index = (y * data.width + x) * 4;
        data.data[index] = (val * 2) % val;
        data.data[index + 1] = (val * 5) % val;
        data.data[index + 2] = (val * 10) % val;
        data.data[index + 3] = 255 - val;
      }
    }

    c.putImageData(data, 0, 0);
  }

  applyFilter() {
    const ctx = this.state.context;

    ctx.globalCompositeOperation = this.state.drawingParams.selectedFilter;
    ctx.fillStyle = this.state.drawingParams.color;
    ctx.fillRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  //=============================================================

  handleDrawButton() {
    const c = this.state.context;
    this.draw(c);
  }

  handleChangeFilterSelect(e) {
    this.changeFilter(e.target.value)
  }

  handleFilterButton() {
    this.applyFilter();
  }

  handleLoadImageButton() {
    const c = this.state.context;
    const img = new Image();

    img.onload = () => {
      c.drawImage(img, 0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
    };

    img.src = "/images/tmp.jpg";
  }

  handleColorLineChange(e) {
    this.changeColor(e.target.value);
  }

  handleColorPickerSelectColor(color, e) {
    this.setState({showColorPicker: false});
    this.changeColor(this.state.drawingParams.newColor);
  };

  handleColorPickerChangingColor(color, e) {
    this.changeTempColor(color.hex);
  }

  handleHuePickerChange(color, e) {
    this.changeColor(color.hex);
    this.changeTempColor(color.hex);
  }

  handleShowColorPickerRequest(e) {
    this.setState({showColorPicker: true});
  }

  handleHideColorPickerRequest()
  {
    this.setState({showColorPicker:false});
  }

  //============================================================================================================

  changeLineWidth(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.lineWidth = val;

    this.setState({drawingParams:drawingParams});
  }

  changeFilter(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.selectedFilter = val;

    this.setState({drawingParams:drawingParams});
  }

  changeColor(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.color = val;

    this.setState({drawingParams:drawingParams});
  }

  changeTempColor(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.newColor = val;

    this.setState({drawingParams:drawingParams});
  }

  updateCanvasWrapperParams()
  {
    const canvasWrapperParams = this.canvasWrapper.getBoundingClientRect();
    this.setState({ canvasWrapperParams: canvasWrapperParams , canvasParams:{width:canvasWrapperParams.width, height:canvasWrapperParams.height}});
  }

  //============================================================================================================

  componentDidMount()
	{
    window.addEventListener("resize", this.updateCanvasWrapperParams);
		this.setState(
		  {
        canvasWrapperParams:  this.canvasWrapper.getBoundingClientRect(),
		    context: this.canvas.getContext('2d')
		  });
	}

  //=======================================================

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
      this.state.context.strokeStyle = this.state.drawingParams.color;

      this.state.context.moveTo(this.state.coords.x, this.state.coords.y);
			this.state.context.lineTo((e.pageX - this.state.canvasWrapperParams.left), (e.pageY - this.state.canvasWrapperParams.top));
      this.state.context.stroke();

      this.setState({coords:{x:e.pageX - this.state.canvasWrapperParams.left, y:e.pageY - this.state.canvasWrapperParams.top}})
		}
	}

	render ()
	{
    const filters = this.state.availableFilters
                    .sort((a,b)=>{return a.name.localeCompare(b.name) })
                    .map( (item, idx) => {return( <option key={idx} value={item.value}>{item.name}</option>)});

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
						<Button className={"rightMenuItem select-disabled"} block onClick={(e) => this.handleDrawButton(e)}>
              Draw Sample
            </Button>

            <hr className={"select-disabled"}/>
            <Button className={"rightMenuItem select-disabled"} block onClick={(e) => this.handleLoadImageButton(e)}>
              Load Sample Image
            </Button>

            <hr className={"select-disabled"}/>
            <Button className={"rightMenuItem select-disabled"} block onClick={(e) => this.handleEraseButton(e)}>
              Erase
            </Button>

            <hr className={"select-disabled"}/>
            <FormControl  className={"rightMenuItem select-disabled"} componentClass="select"
                          value={this.state.drawingParams.selectedFilter} onChange={(e) => this.handleChangeFilterSelect(e)}>
              {filters}
            </FormControl>

            <Button id={"execButton"} className={"rightMenuItem select-disabled"}  block onClick={(e) => this.handleFilterButton(e)}>
              Exec
            </Button>

					</div>
				</div>

				<div id={"instrumentsAreaBottom"}>

          <Clearfix>

            <Col sm={3} xs={3} style={{textAlign:"left"}}>
              <Form inline>
                <FormControl id={"colorShowDiv"}  readOnly={true}
                             style={{backgroundColor:this.state.drawingParams.color}}
                             onClick={(e) => this.handleShowColorPickerRequest(e)}/>
                <FormControl value={this.state.drawingParams.color} onChange={()=>{}} readOnly={true} />
              </Form>
            </Col>

            <Col sm={4} xs={4}>
              <div id={"huePickerWrapper"}>
                <HuePicker color={this.state.drawingParams.color} onChangeComplete={ (color, e) => this.handleHuePickerChange(color, e) }/>
              </div>
            </Col>

            <Col sm={3} xs={3}>
              <Slider
                value={0}
                min={0}
                max={10}
                ticks
                markers={[{value: 3, label: 'Three'}, {value: 8, label: 'Eight'}]}
                onChange={()=>{}}/>
            </Col>

          </Clearfix>

        </div>

        <Modal show={this.state.showColorPicker}>
          <PhotoshopPicker color={this.state.drawingParams.newColor}
            onChangeComplete={ (color, e) => this.handleColorPickerChangingColor(color, e) }
            onCancel={()=>this.handleHideColorPickerRequest()}
            onAccept={(color, e) => this.handleColorPickerSelectColor(color, e)}   id={"modalPicker"}/>
        </Modal>

      </div>
		)
	}
}

export default PaintComponent