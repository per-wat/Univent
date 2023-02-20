import React, {useState, useEffect} from 'react'
import Navbar from './Navbar';
import Popup from "./components/Popup";
import './Booking.css'
import { firestore } from './firebase';
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { useAuthValue } from './AuthProvider';
 
function Booking(){
    const [popupVisible, setPopupVisible] = useState(false); // state for the popup visibility
    const [popupType, setPopupType] = useState(''); // state for the popup type
    const [popupMessage, setPopupMessage] = useState(''); // state for the popup message
    const [needRedirect, setNeedRedirect] = useState(false); // state for redirecting users in Popup
    const [list, setList] = useState([]);
    const listCollectionRef = collection(firestore, "events");
    const [userBookings, setUserBookings] = useState([]);
    const {currentUser} = useAuthValue();

    //For user to book an event
    async function bookEvent(event) {

        if(!currentUser) {
            setPopupType("error");
            setPopupMessage("Please login first!");
            setNeedRedirect(true);
            setPopupVisible(true);
            return;
        }

        const bookingSnap = await getDoc(doc(firestore, "users", currentUser.uid, "bookings", event.id));

        if(bookingSnap.exists()) {
            updateDoc(doc(firestore, "users", currentUser.uid, "bookings", event.id), {
                status: "",
                vacancy: event.vacancy - 1,
            })
            .then(() => {
                updateDoc(doc(firestore, "events", event.id), {
                    vacancy: event.vacancy - 1,
                })
            })
            .then(() => {
                setPopupType("success");
                setPopupMessage("Event successfully booked");
                setPopupVisible(true);
                getUserBookings();
                getList();
            })

        } else {

            setDoc(doc(firestore, "users", currentUser.uid, "bookings", event.id), {
                eventId: event.id,
                title: event.title,
                description: event.description,
                category: event.category,
                startDate: event.startDate,
                endDate: event.endDate,
                startTime: event.startTime,
                endTime: event.endTime,
                status: "",
                vacancy: event.vacancy,
            })
            .then(() => {
                // Get the user data
                const user = getDoc(doc(firestore, "users", currentUser.uid));
                return user;
            })
            .then((user) => {
                const userData = user.data();
                setDoc(doc(firestore, "events", event.id, "attendees", currentUser.uid), {
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    attend: ""
                });
            })
            .then(() => {
                updateDoc(doc(firestore, "events", event.id), {
                    vacancy: event.vacancy - 1,
                })
            })
            .then(() => {
                setPopupType("success");
                setPopupMessage("Event successfully booked");
                setPopupVisible(true);
                getUserBookings();
                getList();
            })
            .catch((error) => {
                setPopupType("error");
                setPopupMessage(error.message);
                setPopupVisible(true);
            });

        }
    };

    const getList = async () => {
        const data = await getDocs(listCollectionRef);
        setList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
    };

    const getUserBookings = async () => {
        const data = await getDocs(collection(firestore, "users", currentUser.uid, "bookings"));
        setUserBookings(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
    }

    useEffect(() =>{
        getUserBookings();
        getList();
    }, [currentUser]);

    //Sort the list so it shows increase from today's date
    const sortedList = list.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        const currentDate = new Date();
        const differenceA = Math.abs(dateA - currentDate);
        const differenceB = Math.abs(dateB - currentDate);
        return differenceA - differenceB;
    });

    //Filtered out event that already passed today's date and time
    const filteredList = sortedList.filter(event => {
        const startDateTimeString = `${event.startDate} ${event.startTime}`;
        const startDateTime = new Date(startDateTimeString);
        return startDateTime.getTime() >= new Date().getTime();
    });
      

    return (
    <div>
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
        <Navbar />
        <div className="container_booking">
        <p>Event Details</p>
        
        <table>
            <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Category</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Vacancy</th>
                <th></th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            {filteredList.map((lists) => {
                //Check if event already booked by user
                const eventBooked = userBookings.some(
                    (booking) => booking.eventId == lists.id && booking.status === ""
                );
                return (
                <tr key={lists.id}>
                    <td>{lists.title}</td>
                    <td>{lists.description}</td>
                    <td>{lists.category}</td>
                    <td>{lists.startDate}</td>
                    <td>{lists.endDate}</td>
                    <td>{lists.startTime}</td>
                    <td>{lists.endTime}</td>
                    <td>{lists.vacancy}</td>
                    <td>
                        {eventBooked ? (
                            <button className='buttonBook booked'>BOOKED</button>
                        ) : lists.vacancy > 0 ? (
                            <button className='buttonBook' onClick={() => bookEvent(lists)}>Book Now</button>
                        ) : (
                            <button className='buttonBook' disabled>FULL</button>
                        )}
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>
        </div>
    </div>
    );

}

export default Booking