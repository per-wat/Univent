import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from './EventCard';
import './Report.css'
import './EventCard.css'
import TimePeriodDropdown from './TimePeriodDropdown';
import TimePeriodIndicator from './TimePeriodIndicator';
import TimePeriodNavigation from './TimePeriodNavigation';
import { firestore } from '../../firebase';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import Navbar from "../../Navbar";
import { useAuthValue } from '../../AuthProvider';

const ReportPage = () => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [timePeriod, setTimePeriod] = useState('Month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const eventsCollectionRef = collection(firestore, "events");
  const {currentUser} = useAuthValue();
  const navigate = useNavigate();
  const todayDate = new Date();

  const getEvents = async() => {
    const userData = await getDoc(doc(firestore, "users", currentUser.uid));
    setUserEvents(userData.data().createdEvents);
    const data = await getDocs(eventsCollectionRef);
    setEvents(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
  }

  useEffect(() => {
    getEvents();
  }, [currentUser]);

  const pastEvents = events.filter((event) => {
    if(userEvents.includes(event.id)) {
      return moment(event.startDate).isBefore(moment(todayDate))
    }
  });
  
  const filteredEvents = pastEvents
    .filter((event) => {
        if (timePeriod === 'Month') {
        return moment(event.startDate).format('YYYY-MM') === moment(currentDate).format('YYYY-MM');
        } else if (timePeriod === 'Week') {
        const start = moment(currentDate).startOf('week');
        const end = moment(currentDate).endOf('week');
        return moment(event.startDate).isBetween(start, end);
        } else if (timePeriod === 'Day') {
        return moment(event.startDate).isSame(currentDate, 'day');
        }
    })
    .sort((a, b) => moment(a.startDate).diff(moment(b.startDate)));

  return (
    <div>
      <Navbar/>
    <div className="report-page">
        <div className='report-page-header'>
            <h3>Report</h3>  
            <TimePeriodDropdown
                timePeriod={timePeriod}
                onTimePeriodChange={setTimePeriod}
            />
            <TimePeriodIndicator timePeriod={timePeriod} currentDate={currentDate} />
            <TimePeriodNavigation
                timePeriod={timePeriod}
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                />
        </div>
        <div className="event-cards-container">
            {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onClick={() => navigate(`/events/report/${event.id}/attendance`)}/>
            ))}
        </div>
    </div>
    </div>
    );
  };
  
  export default ReportPage;