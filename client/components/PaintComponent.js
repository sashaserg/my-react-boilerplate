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

function getTintedColor(color, v)
{
  if (color.length >6)
  {
    color= color.substring(1,color.length)
  }

  let rgb = parseInt(color, 16);
  let r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
  let g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
  let b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
  r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16);
  if (r.length === 1) r = '0' + r;
  g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16);
  if (g.length === 1) g = '0' + g;
  b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16);
  if (b.length === 1) b = '0' + b;
  return "#" + r + g + b;
}

function rotateCoordinates(pX, pY, originX, originY, degree)
{
  let res = {x:0,y:0};

  let x = pX - originX;
  let y = pY - originY;

  res.x = originX + x * Math.cos(degree*Math.PI/180) - y * Math.sin(degree*Math.PI/180);
  res.y = originY + x * Math.sin(degree*Math.PI/180) + y * Math.cos(degree*Math.PI/180);

  return res;
}
//=============================================

class PaintComponent extends Component
{

  constructor(props)
  {
    super(props);

    this.state =
      {
        showColorPicker: false,
        mousePressed: false,
        context: null,

        pause: true,

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
            selectedSample: "chessBoard",
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

        availAbleSamples:
          [
            {value:"chessBoard", name:"Chess Board"},
            {value:"lineHistogram", name:"Line Histogram"},
            {value:"3dRotation", name:"3D Rotation"},
            {value:"snow", name:"Snow"},
            {value:"rotatingAnimation", name:"Rotating Animation"},
            {value:"rotatingCircles", name:"Rotating Circles"},
            {value:"test", name:"Test"}
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

    this.drawRotatingAnimation = this.drawRotatingAnimation.bind(this);
    this.drawSnow = this.drawSnow.bind(this);
    this.drawRotatingCircles = this.drawRotatingCircles.bind(this);
    this.draw3dRotation = this.draw3dRotation.bind(this);
    this.drawTest = this.drawTest.bind(this);
  }

  drawGist()
  {
    const c = this.state.context;

    const data = [];
    for (let i = 0; i < 9; i++)
      data.push(Math.floor((Math.random() * 10000) % 100))

    ///======================

    c.fillStyle = this.state.drawingParams.color;
    for (let i = 0; i < data.length; i++)
    {
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

    for (let i = 0; i < 9; i++)
    {
      c.fillText((9 - i) * 10 + "", 10, i * 80 + 30);
      c.beginPath();

      c.moveTo(30, i * 80 + 25 + 1);
      c.lineTo(40, i * 80 + 25 + 1);
      c.stroke();
    }

    ///======================

    const labels = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];
    for (let i = 0; i < labels.length; i++)
    {
      c.fillText(labels[i], 75 + i * 90, this.state.canvasParams.height - 7);
    }
  }

  drawSnow()
  {
    if( this.state.pause === false )
    {
      window.requestAnimFrame(this.drawSnow);
    }
    else
    {
      return;
    }

    function createParticles()
    {
      let particles = this.state.animationParams.particles;

      if (particles.length < 150)
      {
        let tintValue = Math.floor( 5 + Math.random() * 20 );

        particles.push(
          {
            x: Math.random() * this.state.canvasParams.width,
            y: 0,
            speed: 2 + Math.random() * 4,
            radius: 2 + Math.random() * 12,
            color: getTintedColor(this.state.drawingParams.color, tintValue)
          });
      }

      this.setState({animationParams: {particles: particles}});
    }

    function updateParticles()
    {
      let particles = this.state.animationParams.particles;

      for (let i in particles)
      {
        let part = particles[i];
        part.y += part.speed;
      }

      this.setState({animationParams: {particles: particles}});
    }

    function killParticles()
    {
      let particles = this.state.animationParams.particles;

      particles = particles.filter( (particle) => { return particle.y < this.state.canvasParams.height });
      this.setState({animationParams: {particles: particles}});
    }

    function drawParticles()
    {
      let particles = this.state.animationParams.particles;
      const c = this.state.context;

      c.fillStyle = "black";
      c.shadowBlur = 25;
      c.shadowOffsetX = 0;
      c.shadowOffsetY = -1;

      c.fillRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
      for (let i in particles)
      {
        let part = particles[i];
        c.beginPath();
        c.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        c.closePath();

        c.shadowColor =  getTintedColor(part.color, 25);
        c.fillStyle = part.color;
        c.fill();
      }

      this.setState({animationParams: {particles: particles}});
    }

    //=================================================

    createParticles = createParticles.bind(this);
    updateParticles = updateParticles.bind(this);
    killParticles = killParticles.bind(this);
    drawParticles = drawParticles.bind(this);

    createParticles();
    updateParticles();
    killParticles();
    drawParticles();
  }

  drawChessBoard()
  {
    const c = this.state.context;

    let data = c.createImageData(this.state.canvasParams.width, this.state.canvasParams.height);

    for (let x = 0; x < data.width; x++)
    {
      for (let y = 0; y < data.height; y++)
      {

        let val = 0;
        let horz = (Math.floor(x / 10) % 2 == 0);
        let vert = (Math.floor(y / 10) % 2 == 0);

        if ((horz && !vert) || (!horz && vert))
        {
          val = 150;
        }
        else
        {
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

  drawRotatingAnimation()
  {
    const ctx = this.state.context;

    if( this.state.pause === false )
    {
      window.requestAnimFrame(this.drawRotatingAnimation);
    }
    else
    {
      return;
    }

    //===============================================================================

    ctx.strokeStyle = "#000";
    ctx.fillStyle = this.state.drawingParams.color;
    ctx.lineWidth = this.state.drawingParams.lineWidth;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor =  getTintedColor(this.state.drawingParams.color, 25);

    const startPos = [((Date.now() % 2001) / 1000)*Math.PI, ((Date.now() % 1300) / 650)*Math.PI,  ((Date.now() % 1500) / 750)*Math.PI ] ;
    const startPosReversed = [((2001 - Date.now() % 2001) / 1000)*Math.PI, ((1300 - Date.now() % 1300) / 650)*Math.PI,  ((1500 - Date.now() % 1500) / 750)*Math.PI ] ;

    const center = {x: this.state.canvasParams.width/2, y: this.state.canvasParams.height/2};
    const radius = 100 + Math.abs(25 * Math.sin( ((Date.now()/4000)%2)*Math.PI));

    //=====================================================================================

    ctx.clearRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);

    //======================================================================================


    function drawMovingCircleLines(x,y, r, s1, e1, s2, e2)
    {
      ctx.beginPath();
      ctx.arc(x, y, r, s1, e1);
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.arc(x, y, r, s2, e2);
      ctx.stroke();
      ctx.closePath();
    }

    function drawCircle(x, y, r, s, e)
    {
      ctx.beginPath();
      ctx.arc(x, y, r, s, e);
      ctx.fill();
      ctx.closePath();
    }

    drawMovingCircleLines(center.x, center.y, radius*0.8, startPos[0], (startPos[0] + 0.5 * Math.PI), (startPos[0] + Math.PI), (startPos[0] + Math.PI + 0.5*Math.PI) );
    drawMovingCircleLines(center.x, center.y, radius*1.2, startPos[1], (startPos[1] + 0.3 * Math.PI), (startPos[1] + Math.PI), (startPos[1] + Math.PI + 0.3*Math.PI) );
    drawMovingCircleLines(center.x, center.y, radius*2.0, startPos[2], (startPos[2] + 0.2 * Math.PI), (startPos[2] + Math.PI), (startPos[2] + Math.PI + 0.2*Math.PI) );

    drawMovingCircleLines(center.x, center.y, radius*1.6, (startPosReversed[2] - 0.5 * Math.PI), startPosReversed[2],
     (startPosReversed[2] - Math.PI - 0.5*Math.PI), (startPosReversed[2] - Math.PI));


    //=======================================================================================

    ctx.fillStyle = "#000";

    drawCircle(center.x, center.y, radius*0.3, 0, 2 * Math.PI);
    drawCircle(center.x, center.y, radius*0.15, 0, 2 * Math.PI);

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.arc(center.x, center.y, radius*0.3, 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();

    //=======================================================================================

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  drawRotatingCircles()
  {
    const ctx = this.state.context;

    if( this.state.pause === false )
    {
      window.requestAnimFrame(this.drawRotatingCircles);
    }
    else
    {
      return;
    }

    //===============================================================================

    ctx.strokeStyle = this.state.drawingParams.color;
    ctx.fillStyle = this.state.drawingParams.color;
    ctx.lineWidth = this.state.drawingParams.lineWidth;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetX = 10;
    ctx.shadowOffsetY = 5;
    ctx.shadowColor =  getTintedColor(this.state.drawingParams.color, 25);

    const startPos = [((Date.now() % 2001) / 1000)*Math.PI, ((Date.now() % 1300) / 650)*Math.PI,  ((Date.now() % 1500) / 750)*Math.PI ] ;
    const startPosReversed = [((2001 - Date.now() % 2001) / 1000)*Math.PI, ((1300 - Date.now() % 1300) / 650)*Math.PI,  ((1500 - Date.now() % 1500) / 750)*Math.PI ] ;

    const center = {x: this.state.canvasParams.width/2, y: this.state.canvasParams.height/2};
    const radius = 50;
    const radiusVolatile = 25 + Math.abs(10 * Math.sin( ((Date.now()/1500)%2)*Math.PI));

    //=====================================================================================

    ctx.clearRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);

    //======================================================================================



    function drawCircle(x, y, r, s, e)
    {
      ctx.beginPath();
      ctx.arc(x, y, r, s, e);
      ctx.fill();
      ctx.closePath();
    }


    drawCircle( center.x + 200*Math.cos(startPos[2]), center.y + 200*Math.sin(startPos[2]), radius, 0, 2*Math.PI);
    drawCircle( center.x - 200*Math.cos(startPos[2]), center.y - 200*Math.sin(startPos[2]), radius, 0, 2*Math.PI);
    drawCircle( center.x,  center.y, radiusVolatile*0.5, 0, 2*Math.PI);

    ctx.beginPath();
    ctx.moveTo(center.x + 200*Math.cos(startPos[2]), center.y + 200*Math.sin(startPos[2]));
    ctx.lineTo(center.x - 200*Math.cos(startPos[2]), center.y - 200*Math.sin(startPos[2]));
    ctx.stroke();
    ctx.closePath();

    //=====================================================================================

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  draw3dRotation()
  {
    const ctx = this.state.context;

    if( this.state.pause === false )
    {
      window.requestAnimFrame(this.draw3dRotation);
    }
    else
    {
      return;
    }

    //===============================================================================

    ctx.strokeStyle = this.state.drawingParams.color;
    ctx.fillStyle = this.state.drawingParams.color;
    ctx.lineWidth = this.state.drawingParams.lineWidth;
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor =  getTintedColor(this.state.drawingParams.color, 25);

    const startPos = [((Date.now() % 2001) / 1000)*Math.PI, ((Date.now() % 4000) / 2000)*Math.PI,  ((Date.now() % 1500) / 750)*Math.PI ] ;
    const startPosReversed = [((2001 - Date.now() % 2001) / 1000)*Math.PI, ((1300 - Date.now() % 1300) / 650)*Math.PI,  ((1500 - Date.now() % 1500) / 750)*Math.PI ] ;

    const center = {x: this.state.canvasParams.width/2, y: this.state.canvasParams.height/2};
    const radius = 50;
    const radiusVolatile = 40 + Math.abs(10 * Math.sin( ((Date.now()/1500)%2)*Math.PI));

    const circlesRotationRadius = 250;
    const linesRotationRadius = 150;

    //=====================================================================================

    ctx.clearRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);

    //======================================================================================


    function drawCircle(x, y, r, s, e)
    {
      ctx.beginPath();
      ctx.arc(x, y, r, s, e);
      ctx.fill();
      ctx.closePath();
    }

    function connectLine(x1, y1, x2, y2)
    {
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
      ctx.closePath();
    }

    drawCircle( center.x + circlesRotationRadius*Math.cos(startPos[1]), center.y + circlesRotationRadius*Math.sin(startPos[1]), radiusVolatile, 0, 2*Math.PI);
    drawCircle( center.x - circlesRotationRadius*Math.cos(startPos[1]), center.y - circlesRotationRadius*Math.sin(startPos[1]), radiusVolatile, 0, 2*Math.PI);
    drawCircle( center.x,  center.y, radiusVolatile*0.1, 0, 2*Math.PI);

    connectLine(center.x + linesRotationRadius*Math.cos(startPos[1]), center.y + linesRotationRadius*Math.sin(startPos[1]),
      center.x - linesRotationRadius*Math.cos(startPos[1]), center.y - linesRotationRadius*Math.sin(startPos[1]));

    connectLine(center.x, center.y,
      center.x - linesRotationRadius*Math.cos(startPos[1]) - Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y - linesRotationRadius*Math.sin(startPos[1]) + (radiusVolatile)*Math.cos(startPos[1]));
    connectLine(center.x, center.y,
      center.x - linesRotationRadius*Math.cos(startPos[1]) + Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y - linesRotationRadius*Math.sin(startPos[1]) - (radiusVolatile)*Math.cos(startPos[1]));
    connectLine(center.x - linesRotationRadius*Math.cos(startPos[1]) - Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y - linesRotationRadius*Math.sin(startPos[1]) + (radiusVolatile)*Math.cos(startPos[1]),
      center.x - linesRotationRadius*Math.cos(startPos[1]) + Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y - linesRotationRadius*Math.sin(startPos[1]) - (radiusVolatile)*Math.cos(startPos[1]));

    connectLine(center.x, center.y,
      center.x + linesRotationRadius*Math.cos(startPos[1]) - Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y + linesRotationRadius*Math.sin(startPos[1]) + (radiusVolatile)*Math.cos(startPos[1]));
    connectLine(center.x, center.y,
      center.x + linesRotationRadius*Math.cos(startPos[1]) + Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y + linesRotationRadius*Math.sin(startPos[1]) - (radiusVolatile)*Math.cos(startPos[1]));
    connectLine(center.x + linesRotationRadius*Math.cos(startPos[1]) + Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y + linesRotationRadius*Math.sin(startPos[1]) - (radiusVolatile)*Math.cos(startPos[1]),
      center.x + linesRotationRadius*Math.cos(startPos[1]) - Math.abs((radiusVolatile)*Math.sin(startPos[1])) , center.y + linesRotationRadius*Math.sin(startPos[1]) + (radiusVolatile)*Math.cos(startPos[1])
    );

    //=====================================================================================

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  drawTest()
  {
    const ctx = this.state.context;

    if( this.state.pause === false )
    {
      window.requestAnimFrame(this.drawTest);
    }
    else
    {
      return;
    }

    //===============================================================================

    ctx.strokeStyle = this.state.drawingParams.color;
    ctx.fillStyle = this.state.drawingParams.color;
    ctx.lineWidth = this.state.drawingParams.lineWidth;
    ctx.shadowColor =  getTintedColor(this.state.drawingParams.color, 25);

    const startPos = ((Date.now()) / 2000)*Math.PI;
    const startPosReversed = [((2001 - Date.now() % 2001) / 1000)*Math.PI, ((1300 - Date.now() % 1300) / 650)*Math.PI,  ((1500 - Date.now() % 1500) / 750)*Math.PI ] ;

    const center = {x: this.state.canvasParams.width/2, y: this.state.canvasParams.height/2};
    const radius = 250;
    const radiusVolatile = 25 + Math.abs(10 * Math.sin( ((Date.now()/1500)%2)*Math.PI));

    //=====================================================================================

    ctx.clearRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);

    //======================================================================================

    function drawCircle(x, y, r, s, e)
    {
      ctx.beginPath();
      ctx.arc(x, y, r, s, e);
      ctx.fill();
      ctx.closePath();
    }

    function connectLine(x1, y1, x2, y2)
    {
      ctx.beginPath();
      ctx.moveTo(x1,y1);
      ctx.lineTo(x2,y2);
      ctx.stroke();
      ctx.closePath();
    }

    //ctx.fillStyle = "black";
    //ctx.fillRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
    //ctx.fillStyle = "white";
    //drawCircle( center.x,  center.y, radius, 0, 2*Math.PI);
    drawCircle( center.x,  center.y, radiusVolatile*0.95, 0, 2*Math.PI);


    ctx.lineWidth = 20;
    //connectLine(center.x + 200*Math.cos(startPos), center.y + 200*Math.sin(startPos),
    //  center.x - 200*Math.cos(startPos), center.y - 200*Math.sin(startPos));

    //==================================================================================================================

    connectLine(center.x + 190*Math.cos(startPos), center.y + 190*Math.sin(startPos),
      center.x + 210*Math.cos(startPos+Math.PI/6), center.y + 210*Math.sin(startPos+Math.PI/6));

    connectLine(center.x - 190*Math.cos(startPos), center.y - 190*Math.sin(startPos),
      center.x - 210*Math.cos(startPos+Math.PI/6), center.y - 210*Math.sin(startPos+Math.PI/6));

    //==================================================================================================================

    //connectLine(center.x + 200*Math.cos(startPos+Math.PI/2), center.y + 200*Math.sin(startPos+Math.PI/2),
    //  center.x - 200*Math.cos(startPos+Math.PI/2), center.y - 200*Math.sin(startPos+Math.PI/2));

    //==================================================================================================================

    connectLine(center.x + 190*Math.cos(startPos+Math.PI/2), center.y + 190*Math.sin(startPos+Math.PI/2),
      center.x + 210*Math.cos(startPos+Math.PI/6+Math.PI/2), center.y + 210*Math.sin(startPos+Math.PI/6+Math.PI/2));

    connectLine(center.x - 190*Math.cos(startPos+Math.PI/2), center.y - 190*Math.sin(startPos+Math.PI/2),
      center.x + 210*Math.cos(startPos+Math.PI/6+Math.PI/2), center.y + 210*Math.sin(startPos+Math.PI/6+Math.PI/2));

    //==================================================================================================================


    //==================================================================================================================

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  applyFilter()
  {
    const ctx = this.state.context;

    ctx.globalCompositeOperation = this.state.drawingParams.selectedFilter;
    ctx.fillStyle = this.state.drawingParams.color;
    ctx.fillRect(0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
    ctx.globalCompositeOperation = 'source-over';
  }

  //=============================================================

  handleDrawButton()
  {
    switch(this.state.drawingParams.selectedSample)
    {
      case 'test':
        this.setState({pause:true, animationParams:{particles:[]}}, () => setTimeout( () => {this.setState({pause:false}, () => this.drawTest())}, 10) );
        break;

      case 'chessBoard':
        this.drawChessBoard();
        break;

      case 'lineHistogram':
        this.drawGist();
        break;

      case 'snow':
        this.setState({pause:true, animationParams:{particles:[]}}, () => setTimeout( () => {this.setState({pause:false}, () => this.drawSnow())}, 10) );
        break;

      case 'rotatingAnimation':
        this.setState({pause:true, animationParams:{particles:[]}}, () => setTimeout( () => {this.setState({pause:false}, () => this.drawRotatingAnimation())}, 10) );
        break;

      case 'rotatingCircles':
        this.setState({pause:true, animationParams:{particles:[]}}, () => setTimeout( () => {this.setState({pause:false}, () => this.drawRotatingCircles())}, 10) );
        break;

      case '3dRotation':
        this.setState({pause:true, animationParams:{particles:[]}}, () => setTimeout( () => {this.setState({pause:false}, () => this.draw3dRotation())}, 10) );
        break;

      default:
        break;
    }
  }

  handleStartButton()
  {
    this.changePauseState();
  }

  handleChangeFilterSelect(e)
  {
    this.changeFilter(e.target.value)
  }

  handleChangeSampleSelect(e)
  {
    this.changeSample(e.target.value)
  }

  handleFilterButton()
  {
    this.applyFilter();
  }

  handleLoadImageButton()
  {
    const c = this.state.context;
    const img = new Image();

    img.onload = () =>
    {
      c.drawImage(img, 0, 0, this.state.canvasParams.width, this.state.canvasParams.height);
    };

    img.src = "/images/tmp.jpg";
  }

  handleColorLineChange(e)
  {
    this.changeColor(e.target.value);
  }

  handleColorPickerSelectColor(color, e)
  {
    this.setState({showColorPicker: false});
    this.changeColor(this.state.drawingParams.newColor);
  };

  handleColorPickerChangingColor(color, e)
  {
    this.changeTempColor(color.hex);
  }

  handleHuePickerChange(color, e)
  {
    this.changeColor(color.hex);
    this.changeTempColor(color.hex);
  }

  handleShowColorPickerRequest(e)
  {
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

  changeSample(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.selectedSample = val;

    this.setState({drawingParams:drawingParams});
  }

  changeColor(val)
  {
    let drawingParams = this.state.drawingParams;
    drawingParams.color = val;

    this.setState({drawingParams:drawingParams});
  }

  changePauseState()
  {
    this.setState({pause: !this.state.pause});
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

  //==========================================================================================================

  componentDidMount()
	{
    window.addEventListener("resize", this.updateCanvasWrapperParams);
		this.setState(
		  {
        canvasWrapperParams:  this.canvasWrapper.getBoundingClientRect(),
		    context: this.canvas.getContext('2d')
		  });
	}

  //==========================================================================================================

  handleEraseButton(e)
  {
    this.setState({pause:true, animationParams:{particles:[]}}, () => this.state.context.clearRect(0, 0, this.state.canvasWrapperParams.width, this.state.canvasWrapperParams.height) );
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

    const samples = this.state.availAbleSamples
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
            <FormControl  className={"rightMenuItem select-disabled"} componentClass="select"
                          value={this.state.drawingParams.selectedSample} onChange={(e) => this.handleChangeSampleSelect(e)}>
              {samples}
            </FormControl>
						<Button className={"rightMenuItem select-disabled add-margin-top-10"} block onClick={(e) => this.handleDrawButton(e)}>
              Draw Sample
            </Button>

						<Button className={"rightMenuItem select-disabled add-margin-top-10"} block onClick={(e) => this.handleStartButton(e)} disabled={this.state.pause}>
              Stop
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

            <Button className={"rightMenuItem select-disabled add-margin-top-10"}  block onClick={(e) => this.handleFilterButton(e)}>
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