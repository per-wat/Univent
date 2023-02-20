import React from 'react';
import './EventCard.css'
import { useNavigate } from 'react-router-dom';

const EventCard = (props) => {
  const { event, onClick, isStudent, render } = props;
  const navigate = useNavigate();

  return (
    <div className='event-cards' onClick={onClick}>
      <h3>{event.title}</h3>
      <div className='items'>{event.description}</div> 
      <div className='items'>{event.category}</div>
      <div className='items'>Start Date: {event.startDate}</div>
      <div className='items'>End Date: {event.endDate}</div>
      <div className='items'>Start Time: {event.startTime}</div>
      <div className='items'>End Time: {event.endTime}</div>
      {
        isStudent ? (
          render()
        ) : (
          <div className='items'>Vacancy: {event.vacancy}</div>
        )
      }
    </div>
  );
};

export default EventCard;
