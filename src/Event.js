import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom';
import Navbar from './Navbar';
import Popup from './components/Popup';
import './Event.css'
import { firestore } from './firebase';
import { collection, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
import { useAuthValue } from './AuthProvider';
 
function List(){
    const [list, setList] = useState([]);
    const [userEvents, setUserEvents] = useState([]);
    const listCollectionRef = collection(firestore, "events");
    const [eventId, setEventId] = useState("");
    const [popupVisible, setPopupVisible] = useState(false); // state for the popup visibility
    const {currentUser} = useAuthValue();

    const getList = async () => {
        const userData = await getDoc(doc(firestore, "users", currentUser.uid));
        setUserEvents(userData.data().createdEvents);
        const data = await getDocs(listCollectionRef);
        setList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
    };

    useEffect(() =>{
        getList();
    }, [currentUser]);

    const sortedList = list.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        const currentDate = new Date();
        const differenceA = Math.abs(dateA - currentDate);
        const differenceB = Math.abs(dateB - currentDate);
        return differenceA - differenceB;
    });

    function handleDelete(eventId) {
        setEventId(eventId);
        setPopupVisible(true);
    }

    function onConfirm() {
        deleteDoc(doc(firestore, "events", eventId)).then(() => {
            getList();
        });
        setPopupVisible(false);
    }

    function onCancel() {
        setPopupVisible(false);
    }

    return (
    <div>
        {/* render the Popup component if it's visible */}
        {popupVisible && (
            <Popup
                message={"Are you sure you want to delete this event?"}
                type={"confirm"}
                onConfirm={onConfirm}
                onCancel={onCancel}
            />
        )}
        <Navbar />
        <div className="container1">
        <p>Event Details</p>
        <div>
            <Link to="/events/create" className="buttonCreate">
            <button className='btnCreate'>+ CREATE</button>
            </Link>
        </div>
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
            {sortedList.map((lists) => {
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
                        <button className={`buttonEdit ${userEvents.includes(lists.id) ? '' : 'disabled'}`}>
                        <Link to={`/events/${lists.id}/edit`} className="edit" onClick={(event) => {if (!userEvents.includes(lists.id)) event.preventDefault()}}>Edit</Link>
                        </button>
                    </td>
                    <td>
                        <button onClick={(event) => {if (userEvents.includes(lists.id)) handleDelete(lists.id)}} className={`buttonEdit ${userEvents.includes(lists.id) ? '' : 'disabled'}`}>Delete</button>
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

export default List