import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import Navbar from './Navbar';
import './Attendance.css'
import { firestore } from './firebase';
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
 
function Attendance(){
    const {eventId} = useParams();
    const [list, setList] = useState([]);
    const [eventTitle, setEventTitle] = useState("");
    const [presentCount, setPresentCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const eventTitleRef = doc(firestore, "events", eventId);
    const listCollectionRef = collection(firestore, "events", eventId, "attendees");

    const getEventTitle = async () => {
        const data = await getDoc(eventTitleRef);
        setEventTitle(data.data().title);
    };

    const getList = async () => {
        const data = await getDocs(listCollectionRef);
        setList(data.docs.map((doc)=>({...doc.data(), id: doc.id})));
    };

    useEffect(() =>{
        getEventTitle();
        getList();
    },[]);

    useEffect(() => {
        const counts = list.reduce((acc, attendee) => {
          if (attendee.attend === 'true') {
            acc.present += 1;
          } else {
            acc.absent += 1;
          }
          return acc;
        }, { present: 0, absent: 0 });
    
        setPresentCount(counts.present);
        setAbsentCount(counts.absent);
    }, [list]);

    const sortedList = list.sort((a, b) => {
        if (a.firstName < b.firstName) {
          return -1;
        }
        if (a.firstName > b.firstName) {
          return 1;
        }
        return 0;
    });

    return (
    <div>
        <Navbar />
        <div className="container1">
            <div className='attendance-header'>
                <p>Attendance</p>
                <p>{eventTitle}</p>
                <div className='counter-box'>
                    <div className='counter-item'>
                        <p>Present:</p>
                        <div className='count'>{presentCount}</div>
                    </div>
                    <div className='counter-item'>
                        <p>Absent:</p>
                        <div className='count'>{absentCount}</div>
                    </div>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Email Address</th>
                        <th>Full Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedList.map((lists) => {
                        return (
                        <tr key={lists.id}>
                            <td>{lists.email}</td>
                            <td>{lists.firstName} {lists.lastName}</td>
                            <td className={lists.attend === 'true' ? 'attend-present' : 'attend-absent'}>
                                {lists.attend === 'true' ? 'Present' : 'Absent'}
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

export default Attendance