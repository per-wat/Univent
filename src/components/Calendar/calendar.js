import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CalendarToolBar from './toolbar';
import { firestore } from "../../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Navbar from "../../Navbar";
import { useAuthValue } from '../../AuthProvider';

import './calendar.scss';
import '../../../node_modules/react-big-calendar/lib/sass/styles.scss';

// Setting the date and time configuration
const localizer = momentLocalizer(moment);
const formats = {
    timeRangeFormat: ({ start, end }) => {
        return `${moment(start).format('h:mm a')} - ${moment(end).format('h:mm a')}`;
    },
    eventTimeRangeFormat: ({ start, end }, culture, local) => {
        // Check if the event is for multiple days
        const isMultipleDays = moment(start).diff(moment(end), 'days') !== 0;
        if (isMultipleDays) {
        // If the event is for multiple days, show the start and end dates
        return `${moment(start).format('MMM D')} - ${moment(end).format('MMM D')}`;
        } else {
        // If the event is not for multiple days, show the start and end times
        return `${moment(start).format('h:mm a')} - ${moment(end).format('h:mm a')}`;
        }
    },
};


const eventsCollectionRef = collection(firestore, "events");

function eventStyleGetter(event, start, end, isSelected) {
  // code to determine event style based on category
  let bgColor, textColor;
  if (event.category === 'Event') {
    bgColor = '#FFA1A1';
    textColor = 'black';
  } else if (event.category === 'Training') {
    bgColor = '#99DBD7';
    textColor = 'black';
  } else if (event.category === 'Seminar') {
    bgColor = '#999AFF';
    textColor = 'black';
  } else {
    bgColor = '#3174AD';
    textColor = 'white';
  }

  return {
    style: {
      backgroundColor: bgColor,
      color: textColor,
      textTransform: 'uppercase',
    },
  };
}

function BigCalendar() {
  const [events, setEvents] = useState([]);
  const [userRole, setUserRole] = useState('');
  const {currentUser} = useAuthValue();

  useEffect(() => {
    async function getUserRole() {
      const data = await getDoc(doc(firestore, "users", currentUser.uid));
      setUserRole(data.data().role);
    }

    async function fetchEvents() {
        const data = await getDocs(eventsCollectionRef);
        const events = data.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      
        const formattedEvents = events.map((event) => {
          // Combine the date and time values using moment
          const start = moment(event.startDate).hour(event.startTime.split(':')[0]).minute(event.startTime.split(':')[1]);
          const end = moment(event.endDate).hour(event.endTime.split(':')[0]).minute(event.endTime.split(':')[1]);

          // Check if the event is for multiple days
          const isMultipleDays = start.diff(end, 'days') !== 0;
          
          return {
            id: event.id,
            category: event.category,
            title: `${event.category}: ${event.title}`,
            start: start.toDate(),
            end: end.toDate(),
            allDay: isMultipleDays,
          };
        });
      
        setEvents(formattedEvents);
    }
  getUserRole();  
  fetchEvents();
}, []);

const navigate = useNavigate();

function handleEventClick(event) {
  if (userRole === "admin") {
    navigate('/events');
  } else {
    navigate('/booking')
  }
}

return (
  <div>
    <Navbar/>

  <div className="outer-box">
    <div className="inner-box">
      <div className="custom-height">
        <Calendar
          localizer={localizer}
          views={{
            month: true,
            week: true,
            day: true,
          }}
          events={events}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CalendarToolBar,
          }}
          formats={formats}
          onSelectEvent={handleEventClick}
        />
        <div className='lgn-box'>
          <div className='lgn-elem'>
            <div className='lgn-color event'></div><div className='lgn-tag event'>Event</div>
          </div>
          <div className='lgn-elem'>
            <div className='lgn-color train'></div><div className='lgn-tag train'>Training</div>
          </div>
          <div className='lgn-elem'>
            <div className='lgn-color seminar'></div><div className='lgn-tag seminar'>Seminar</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

);
}

export default BigCalendar;
