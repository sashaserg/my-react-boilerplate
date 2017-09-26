import React, {Component} from 'react'

import {Button, Grid, Row} from 'react-bootstrap'

const soundsMap =
	{
		"49":"261-C",
		"50":"277-C-sharp",
		"51":"293-D",
		"52":"311-D-sharp",
		"53":"329-E",
		"54":"349-F",
		"55":"369-F-sharp",
		"56":"391-G",
		"57":"415-G-sharp",
		"58":"440-A",
		"59":"466-A-sharp",
		"60":"495-B"
	};

class MusicElement extends Component
{

	handleButtonClick(e, code)
	{
		new Audio(`/midia/${soundsMap[code]}.mp3`).play();
	}

	handleKeyPress(e)
	{
		if( soundsMap[e.charCode] !== undefined )
		{
			new Audio(`/midia/${soundsMap[e.charCode]}.mp3`).play();
		}
	}

	render()
	{

		return(
			<Grid fluid={true} onKeyPress={this.handleKeyPress}>

				<Row className={"text-center"}>

					<div id={"pianoContainer"}>
						<div id={"pianoBorder"}>
							<Button className={"tone-full C"}  onClick={(e)=>this.handleButtonClick(e,"49")}/>
							<Button className={"tone-half C#"}  onClick={(e)=>this.handleButtonClick(e,"50")}/>
							<Button className={"tone-full D"} onClick={(e)=>this.handleButtonClick(e,"51")}/>
							<Button className={"tone-half D#"} onClick={(e)=>this.handleButtonClick(e,"52")}/>
							<Button className={"tone-full E"} onClick={(e)=>this.handleButtonClick(e,"53")}/>
							<Button className={"tone-full F"} onClick={(e)=>this.handleButtonClick(e, "54")}/>
							<Button className={"tone-half F#"} onClick={(e)=>this.handleButtonClick(e,"55")}/>
							<Button className={"tone-full G"} onClick={(e)=>this.handleButtonClick(e,"56")}/>
							<Button className={"tone-half G#"} onClick={(e)=>this.handleButtonClick(e,"57")}/>
							<Button className={"tone-full A"} onClick={(e)=>this.handleButtonClick(e,"58")}/>
							<Button className={"tone-half A#"} onClick={(e)=>this.handleButtonClick(e,"59")}/>
							<Button className={"tone-full B"} onClick={(e)=>this.handleButtonClick(e,"60")}/>
						</div>
					</div>

				</Row>
			</Grid>
		)
	}
}

export default MusicElement;