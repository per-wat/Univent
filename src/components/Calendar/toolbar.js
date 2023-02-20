import React from 'react';
import Toolbar from 'react-big-calendar/lib/Toolbar';

import './toolbar.scss'

export default class CalendarToolbar extends Toolbar {

	render() {
		return (
			<div className='rbc-toolbar custom-style'>
                <img className="rbc-toolbar-icon"></img>
                <div className="rbc-toolbar-label custom-style">{this.props.label}</div>
				<div className="rbc-btn-group custom-style">
					<button className='nextp-btn' type="button" onClick={() => this.navigate('PREV')}><span className='arrow left'></span></button>
					<button className='nextp-btn' type="button" onClick={() => this.navigate('NEXT')}><span className='arrow right'></span></button>
				</div>
				<div className="rbc-btn-group custom-style">
					<button type="button" onClick={this.view.bind(null, 'month')}>Month</button>
					<button type="button" onClick={this.view.bind(null, 'week')}>Week</button>
					<button type="button" onClick={this.view.bind(null, 'day')}>Day</button>
				</div>
			</div>
		);
	}
}