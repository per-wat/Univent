import React, {useEffect, useState} from "react";
import Navbar from "./Navbar";
import "./History.css";
import { firestore } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuthValue } from "./AuthProvider";
import moment from "moment";

function History() {
    const [events, setEvents] = useState([]);
    const {currentUser} = useAuthValue();

    const getEvents = async() => {
        const data = await getDocs(collection(firestore, "users", currentUser.uid, "bookings"));
        setEvents(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }

    useEffect(() => {
        getEvents();
    }, [currentUser]);

    return (
        <div>
            <Navbar />
            <div className="container1">
                <h2 className="history-header">History</h2>
                <div className="history-list">   
                    {events.map((event) => (
                        <div key={event.id}>
                            <div className="date">{moment(event.startDate).format('DD MMM YYYY')}</div>
                            <div className="title">{event.title}</div>
                            <div className={`status status-${event.status}`}>
                                {event.status === 'attended' ? "Successfully Attended" : event.status === 'cancelled' ? "Cancelled Booking" : "Successfully Booked"}
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default History