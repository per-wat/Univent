import './App.css';
import Register from './Register';
import Login from './Login';
import Crud from './components/Crud';
import BigCalendar from './components/Calendar/calendar';
import List from './Event';
import EditEvent from './components/EditEvent';
import ReportPage from './components/Report/Report';
import Attendance from './Attendance';
import Booking from './Booking';
import Profile from './Profile';
import History from './History';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import PrivateRoute from './PrivateRoute';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import MyBooking from './MyBooking';

function App() {

  const [currentUser, setCurrentUser] = useState(null)
  const [timeActive, setTimeActive] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
  }, [])

  return (
    <div className="App">
      <Router>
        <AuthProvider value={{currentUser, timeActive, setTimeActive}}>
          <Routes>
            <Route exact path="/" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/events/create" element={
              <PrivateRoute requiredRole="admin"><Crud/></PrivateRoute>
            } />
            <Route path="/calendar" element={
              <PrivateRoute><BigCalendar/></PrivateRoute>
            } />
            <Route path="/events" element={
              <PrivateRoute requiredRole="admin" ><List/></PrivateRoute>
            } />
            <Route path="/events/:eventId/edit" element={
              <PrivateRoute requiredRole="admin"><EditEvent/></PrivateRoute>
            } />
            <Route path="/events/report" element={
              <PrivateRoute requiredRole="admin"><ReportPage/></PrivateRoute>
            } />
            <Route path="/events/report/:eventId/attendance" element={
              <PrivateRoute requiredRole="admin"><Attendance/></PrivateRoute>
            } />
            <Route path="/booking" element={
              <PrivateRoute requiredRole="student"><Booking/></PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute><Profile /></PrivateRoute>
            } />
            <Route path="/mybooking" element={
              <PrivateRoute requiredRole="student"><MyBooking/></PrivateRoute>
            } />
            <Route path="/history" element={
              <PrivateRoute requiredRole="student"><History/></PrivateRoute>
            } />
          </Routes>
          </AuthProvider>
      </Router>
    </div>
  )
}

export default App;