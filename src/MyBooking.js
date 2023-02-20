import React, { useState, useEffect } from 'react';
import EventCard from './components/Report/EventCard';
import Popup from './components/Popup';
import './components/Report/EventCard.css'
import TimePeriodDropdown from './components/Report/TimePeriodDropdown';
import TimePeriodIndicator from './components/Report/TimePeriodIndicator';
import TimePeriodNavigation from './components/Report/TimePeriodNavigation';
import { firestore } from './firebase';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { useAuthValue } from './AuthProvider';
import moment from 'moment';
import Navbar from './Navbar';
import "./MyBooking.css"

const MyBooking = () => {
    const [popupVisible, setPopupVisible] = useState(false); // state for the popup visibility
    const [popupType, setPopupType] = useState(''); // state for the popup type
    const [popupMessage, setPopupMessage] = useState(''); // state for the popup message
    const [needRedirect, setNeedRedirect] = useState(false); // state for redirecting users in Popup
    const [events, setEvents] = useState([]);
    const [timePeriod, setTimePeriod] = useState('Month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const {currentUser} = useAuthValue();

    const getEvents = async() => {
        const data = await getDocs(collection(firestore, "users", currentUser.uid, "bookings"));
        setEvents(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    useEffect(() => {
        getEvents();
    }, [currentUser]);

    const upcomingEvents = events
        .filter((event) => {
            const endDateTime = moment(event.endDate + ' ' + event.endTime, 'YYYY-MM-DD HH:mm');
            return moment().isBefore(endDateTime);
    });
    
    const filteredEvents = upcomingEvents
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

    const handleAttend = (event) => {
        updateDoc(doc(firestore, "users", currentUser.uid, "bookings", event.id), {
            status: "attended",
        })
        .then(() => {
            updateDoc(doc(firestore, "events", event.id, "attendees", currentUser.uid), {
                attend: "true"
            })
        })
        .then(() => {
            setPopupType("success");
            setPopupMessage("You have attended the event");
            setPopupVisible(true);
            getEvents();
        })
    };

    const handleCancel = (event) => {
        updateDoc(doc(firestore, "users", currentUser.uid, "bookings", event.id), {
            status: "cancelled",
        })
        .then(() => {
            console.log(event);
            updateDoc(doc(firestore, "events", event.id), {
                vacancy: event.vacancy + 1,
            });
        })
        .then(() => {
            setPopupType("error");
            setPopupMessage("You have cancelled the event");
            setPopupVisible(true);
            getEvents();
        })
    }

    const bottomRender = (event) => {

        const startDateTime = moment(event.startDate + ' ' + event.startTime, 'YYYY-MM-DD HH:mm');

        if (event.status === "attended" && startDateTime.isBefore(moment())) {
            return (
                <>
                <div>Status : Attended</div>
                <button className='btnAttend' onClick={() => handleAttend(event)} 
                disabled={event.status === 'attended'}>Attend</button>
                <button className='btnStatus' onClick={() => handleCancel(event)}>Cancel</button>
                </>
            )
        } else if (event.status === "" && startDateTime.isBefore(moment())) {
            return (
                <>
                <div className='ActiveStatus'>Status : Active</div>
                <button className='btnAttend'
                onClick={() => handleAttend(event)}>Attend</button><button className='btnStatus' onClick={() => handleCancel(event)}>Cancel</button>
                </>
            )
        } else if (event.status === "") {
            return (
                <>
                <div className='ComingStatus'>Status : Upcoming</div>
                <button className='btnStatus' onClick={() => handleCancel(event)}>Cancel</button>
                </>
            )
        } else if (event.status === "cancelled") {
            return (
                <>
                <div className='CancelStatus'>Status : Cancelled</div>
                </>
            )
        }
    }

    return (
        <div>
            <Navbar/>
        <div className="booking-page">
            {/* render the Popup component if it's visible */}
            {popupVisible && (
                    <Popup
                        message={popupMessage}
                        type={popupType}
                        onClose={() => setPopupVisible(false)}
                        needRedirect={needRedirect}
                        urlRedirect={'/'}
                    />
            )}
            <div className='booking-page-header'>
                <h3>My Booking</h3>  
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
                <EventCard key={event.id} event={event} isStudent={true} render={() => bottomRender(event)}/>
                ))}
            </div>
        </div>
        </div>
    );
};
  
export default MyBooking;