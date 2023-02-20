import React, { useState} from 'react';
import Popup from './Popup';
import './Crud.css'
import { addDoc, collection, doc, updateDoc, arrayUnion} from "firebase/firestore";
import { firestore } from '../firebase';
import {Link} from 'react-router-dom';
import { useAuthValue } from '../AuthProvider';
import moment from 'moment';


function Crud() {
 
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [vacancy, setVacancy] = useState("");
    const [popupVisible, setPopupVisible] = useState(false); // state for the popup visibility
    const [popupType, setPopupType] = useState(''); // state for the popup type
    const [popupMessage, setPopupMessage] = useState(''); // state for the popup message
    const [needRedirect, setNeedRedirect] = useState(false); // state for redirecting users in Popup
    const {currentUser} = useAuthValue();
    const todayDate = new Date();


    const handleSubmit = async (e) => {
        e.preventDefault();

        // check if any of the fields is not filled
        if (!title || !description || !category || !startDate || !endDate || !startTime || !endTime || !vacancy) {
            setPopupType('error');
            setPopupMessage('All fields are required');
            setPopupVisible(true);
            return;
        }

        // check if end date is before start date
        if (new Date(endDate) < new Date(startDate)) {
            setPopupType('error');
            setPopupMessage('End date cannot be before start date');
            setPopupVisible(true);
            return;
        }

        // check if end time is before start time
        if (new Date(`${endDate}T${endTime}`) < new Date(`${startDate}T${startTime}`)) {
            setPopupType('error');
            setPopupMessage('End time cannot be before start time');
            setPopupVisible(true);
            return;
        }

        // check if time is the same for start and end
        if (endTime === startTime) {
            setPopupType('error');
            setPopupMessage('Start time and End time should not be the same. Event need to be at least 1 minute');
            setPopupVisible(true);
            return;
        }

        // check if the start of event is in the past
        if (moment(`${startDate}T${startTime}`).isBefore(moment(todayDate))) {
            setPopupType('error');
            setPopupMessage('You cannot create event in the past');
            setPopupVisible(true);
            return;
        }

        // check if there's no vacancy
        if (vacancy <= 0) {
            setPopupType('error');
            setPopupMessage('There need to be at least 1 vacancy!');
            setPopupVisible(true);
            return;
        }
        
        try {
            const docRef = await addDoc(collection(firestore, "events"), {
                title : title,
                description : description,
                startDate : startDate,
                endDate: endDate,
                category : category,
                startTime : startTime,
                endTime : endTime,
                vacancy : vacancy,

            });
            await updateDoc(doc(firestore, "users", currentUser.uid), {
                createdEvents: arrayUnion(docRef.id),
            })
            setPopupType('success');
            setPopupMessage('Event created successfully');
            setNeedRedirect(true);
            setPopupVisible(true);
        } catch (error) {
        console.error(error);
        }
    }

    return(
        <div>
           {/* render the Popup component if it's visible */}
           {popupVisible && (
            <Popup
                message={popupMessage}
                type={popupType}
                onClose={() => setPopupVisible(false)}
                needRedirect={needRedirect}
                urlRedirect={'/events'}
            />
           )}
            <div className="crud_container">
                <div className="crud-body">
                    
                    <div className="title">
                        <input className="crud__input" type="text" placeholder="Add Title" value={title}  onChange={(e)=>setTitle(e.target.value)}/>
                    </div>
                         
                    <div className='category' value={category} onChange={(e)=>setCategory(e.target.value)} >
                        <input type="radio"  name="category" value="Event"/> Event
                        <input type="radio"  name="category" value="Training"/> Training
                        <input type="radio"  name="category" value="Seminar"/> Seminar
                
                    </div>

                    <div className="startDate">
                        <label className="crud_label" for="startDate">Start Date </label>
                        <input className="crud__input" type="date"  id="startDate"  placeholder="Date" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                    </div>
                    <div className="endDate">
                        <label className="crud__label" for="endDate">End Date </label>
                        <input className="crud__input" type="date" id="endDate"  placeholder="Date" value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                    </div>

                    <div className="startTime">
                        <label className="crud_label" for="startTime">Start Time </label>
                        <input className="crud__input" type="time"  id="startTime"  placeholder="Time" value={startTime} onChange={(e)=>setStartTime(e.target.value)}/>
                    </div>
                    <div className="startTime">
                        <label className="crud__label" for="endTime">End Time </label>
                        <input className="crud__input" type="time" id="endTime"  placeholder="Time" value={endTime} onChange={(e)=>setEndTime(e.target.value)}/>
                    </div>

                    <div className="description">
                        <input  type="text" id="description"  placeholder="Add Description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    </div>
               
                    <div className="vacancy">
                        <label className="crud__label" for="vacancy">Vacancy </label>
                        <input className="crud__input" type="number" id="vacancy"  placeholder="" value={vacancy} onChange={(e)=>setVacancy(e.target.value)}/>
                    </div>
                
                    <div className="btnLine">
                        <button onClick={handleSubmit} type="submit" className="buttonCrud">Save</button>
                        <button className='buttonCancel'>
                            <Link to="/events" className='linkCancel'>Cancel</Link>
                        </button>
                    </div>

            </div>
            </div>
        </div>
    )       
}

export default Crud;